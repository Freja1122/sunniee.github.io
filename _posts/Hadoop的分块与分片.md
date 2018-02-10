title: Hadoop的分块与分片
---

Hadoop的分块与分片学习笔记



<!-- more -->

[TOC]


## 分块

### 目的
Hadoop分块是为了便于文件的管理和备份

### 默认块大小

HDFS默认定义其大小为128MB

**磁盘的块大小通常为4k，为什么HDFS的块比磁盘快大？**

* **减少寻址开销**

  HDFS主要支持大容量流式数据操作，如果设置的数据块过小，那数据块总数就会过多。数据块在硬盘上并非连续存储，普通硬盘需要移动磁头，随机寻址较慢，合适的块大小可以减少寻址时间，提高系统吞吐量。

  > 如果块设置得足够大，从磁盘传输数据的时间可以明显大于定位这个块开始位置所需的时间。这样，传输一个由多个块组成的文件的时间取决于磁盘传输速率。

* **减少Namenode内存消耗**

  HDFS只有一个active namenode，它的内存十分有限。namenode中药存储所有存储在Datanode中的数据块信息，如果数据块信息过多，namenode需要存储和维护的信息也就越多。

**为什么HDFS的块不能设置得更大？**

* Map崩溃问题

  map作业会发生崩溃，这个时候需要重做或者发给其他datanode完成，系统需要重新启动，启动过程需要重新加载数据，数据块越大，数据加载时间越长，系统恢复过程越长

* 监管时间问题

  主节点监管其他节点的情况，每个节点会周期性的把完成的工作和状态的更新报告回来。如果一个节点保持沉默超过一个预设的时间间隔，主节点记录下这个节点状态为死亡，并把分配给这个节点的数据发到别的节点。对于这个“预设的时间间隔”，这是从数据块的角度大概估算的。如果一个块过于大，namenode对于datanode的预设时间间隔不好设置

* 每个map作业运行时间过长

  数据量大小是问题解决的复杂度是成线性关系的。对于同个算法，处理的数据量越大，它的时间复杂度也就越大。

* 可以运行的map作业数量过小

  MapReduce中的map任务通常一次处理一个块中的数据，因此如果任务数太少（少于集群中的节点数量），作业的运行速度就会比较慢。 

* 约束Map输出

  在Map Reduce框架里，Map之后的数据是要经过排序才执行Reduce操作的。排序阶段如果数据量过大排序时间更长。

### 分块存储的特点

**块是存储的基本单位**

* 多个块可以存放在不同的DataNode上
* 一个块存储在一个Datanode上
* 两个文件通常不会用同一个块
  * 大文件被分为多个块存放
  * 小文件独占一个块

- 元信息(MetaInfo)：NameNode会记录在上述文件分块中文件的各个块都存放在哪个DataNode上
  **块是备份的基本单位**

 - datanode数量小于3的时候，块的复制份数不会超过3

**Map任务不会跨块处理**

### 分块存储的优势

* 某文件所需存储空间可以大于集群中任意磁盘的容量
* 块作为存储单元，简化了存储子系统的设计
* 块作为备份的单元，即使有文件损坏也只是块级别损坏，只需要恢复块级数据，增强了Hadoop的存储容错能力
* 元数据可以交由系统的某一模块进行统一管理

### 配置文件

配置文件存储位置：$HADOOP_HOME/etc/hadoop/

#### hdfs-site.xml

默认参数解释：

```
dfs.name.dir：用于确定将HDFS文件系统的元信息保存在什么目录下，如果设置为多个目录，那么这些目录下都保存着元信息的多个备份。
dfs.data.dir：用于确定将HDFS文件系统的数据保存在什么目录下。可以将这个参数设置为多个分区上目录，即可将HDFS建立在不同分区上。
dfs.http.address：NameNode web管理端口，默认为0.0.0.0:50070
dfs.replication：缺省的块复制数量，默认为3
```

可以新增下面参数控制块大小：

```
<property> 
  <name>dfs.block.size</name> 
  <value>134217728</value> 
</property> 
```

(这个就是默认的每个块128MB)

### 查看分块状态命令

命令1：

```
hadoop fsck [hadoop文件目录中的路径] -files -blocks
```

 - 查询块的分配情况
 - 查询块的健康状况


命令2：

```
hadoop fs –stat [format] [hadoop文件目录中的路径]
format的形式:
%b：打印文件大小（目录为0）
%n：打印文件名
%o：打印block size （我们要的值）
%r：打印备份数
%y：打印UTC日期 yyyy-MM-dd HH:mm:ss
%Y：打印自1970年1月1日以来的UTC微秒数
%F：目录打印directory, 文件打印regular file
当使用-stat选项但不指定format时候，只打印文件创建日期，相当于%y
```

因此可以使用如下命令查看block size和备份数量

```
hadoop fs -stat "%o %r" [hadoop文件目录中的路径]
```



### 更改集群分块大小操作

1. 修改hdfs-site.xml中dfs.blocksize的大小

   > Hadoop限制了参数单位至少是10m

   ```
   <property>  
     <name>dfs.block.size</name>  
     <value>10m</value>  
   </property>  
   ```

2. 将此配置复制到集群的所有NameNode和DataNode上

3. 在NameNode节点上执行以下命令（无需重启）

   ```
   hadoop dfsadmin -refreshNodes  
   yarn rmadmin -refreshNodes  
   ```



## 分片

MapReduce在处理过程中主要分为四个阶段：

* Split（分片）阶段
* Map阶段
* Shuffle（混排、重拍）阶段
* Reduce阶段。

Split（分片）阶段将MapReduce的输入数据划分为等长的数据块，经过一些列处理后，文件数据将以<key,value>键值对的方式进入到Map阶段中。

### 分片的大小

**Hadoop在不大于block和maxsize的小值，并且不小于在mapred.min.split.size中取最大值来定义splitSize**

InputSplitFormat：指定分片细节

> Hadoop2.6.0

```
protected long computeSplitSize(long blockSize, long minSize, long maxSize) {  
  return Math.max(minSize, Math.min(maxSize, blockSize));  
} 
```
  * maxSize：配置文件mapred.max.split.size的值，如果不配置，默认值是long类型的最大值

  - minsize：配置文件mapred.min.split.size的值

  - blockSize：128(默认情况)

    > Hadoop2.6.0

    ```
    protected long computeSplitSize(long goalSize, long minSize, long blockSize) {
        return Math.max(minSize, Math.min(goalSize, blockSize));
    }
    ```

* goalSize：(InputFile的大小)/（配置文件中定义的mapred.map.tasks的值）

- minsize：配置文件mapred.min.split.size的值
- blockSize：128(默认情况)

**默认情况下，以HDFS的一个块的大小（默认为128M）为一个分片。**

原因如下

* map数量角度	
  - map任务数=输入文件总大小/分片尺寸，所以分片越大，map任务数越少，从而系统执行开销越小。
* 管理分片开销
  - 分片越大，则分片数量越少，越容易管理。
* 网络传输开销
  - 数据本地化：hadoop在存储有输入数据（HDFS中的数据）的节点上运行map任务，可以获得高性能
  - 如果分片太大以至于一个分片要跨越多个HDFS块，则一个map任务必须要由多个块通过网络传输，与使用本地数据运行map任务相比，导致处理时间增长。

### 分片特点

**Split分片只是对一个文件进行逻辑上的分片**

目的是为了让Map Task更好的获取数据输入数据还是按照Block的方式保存在HDFS中

**在Hadoop0.18.3中，split划分由JobClient完成**

JobClient划分好后，把split.file写入hdfs里，供给jobtracker端读取。

### 分片相关三个类

#### 类一：FileSplit.class

描述：记录分片的信息

一个Split分片的内容主要包括

* Path file：数据的位置在哪里
* Long start：文件的哪个位置开始
* Long length：长度是多少
* String[] hosts：存储了一个Block的冗余机器列表

使用：在读取分片数据的时候，是根据FileSplit类中的信息去读取相应的Block的数据

#### 类二：InputFormat.class

描述：实现对文件的分片和读取\<key,value>值的过程。

由下面这两个函数完成

##### 方法一：getSplits()

总体功能描述：得到对文件的分片信息,读取分片表示的数据，生成分片：ArrayList\<FileSplit>

源代码：

源码中有两个InputFormat.class

* org.apache.hadoop.mapreduce.lib.input.FileInputFormat
* org.apache.hadoop.mapred.FileInputFormat

> They are separated out because both of these packages represent 2 different APIs. `org.apache.hadoop.mapred` is the older API and `org.apache.hadoop.mapreduce` is the new one. And it was done to allow programmers write MapReduce jobs in a more convenient, easier and sophisticated fashion. You might find this [presentation](http://www.slideshare.net/sh1mmer/upgrading-to-the-new-map-reduce-api) useful, which talks about the differences in detail.

新版：

>  Hadoop3.0.0
>
>  org.apache.hadoop.mapreduce.lib.input.FileInputFormat.java
>
>  public abstract class FileInputFormat<K, V> extends InputFormat<K, V>

```
  /** 
   * Generate the list of files and make them into FileSplits.
   * @param job the job context
   * @throws IOException
   */
public List<InputSplit> getSplits(JobContext job) throws IOException {
    StopWatch sw = new StopWatch().start();
    
    // minSize：控制map任务输入划分的最小字节数
	// maxSize：控制map任务输入划分的最大字节数
	// getFormatMinSplitSize方法固定返回1
    // getMinSplitSize方法是mapreduce.input.fileinputformat.split.minsize参数的值
    // (默认为1)
    // getMaxSplitSize方法是mapreduce.input.fileinputformat.split.maxsize参数的值
    // (默认最大为9223372036854775807L)
    long minSize = Math.max(getFormatMinSplitSize(), getMinSplitSize(job));
    long maxSize = getMaxSplitSize(job);

    // generate splits
    // 保存最后产生的所有分片的数组，分片类类型为InputSplit
    List<InputSplit> splits = new ArrayList<InputSplit>();
    List<FileStatus> files = listStatus(job);
    
    // 遍历所有要处理的文件
    for (FileStatus file: files) {
      Path path = file.getPath();
      long length = file.getLen();
      if (length != 0) {
      
      	// 创建BlockLocation数组，准备记录该文件所有Block的位置 
        BlockLocation[] blkLocations;
        if (file instanceof LocatedFileStatus) {
          blkLocations = ((LocatedFileStatus) file).getBlockLocations();
        } else {
          FileSystem fs = path.getFileSystem(job.getConfiguration());
          blkLocations = fs.getFileBlockLocations(file, 0, length);
        }
        
        // 判断文件是否可分
        if (isSplitable(job, path)) {
        
          // blockSize是hdfs-site.xml中dfs.blocksize定义的block大小
          long blockSize = file.getBlockSize();
          
          // （maxSize与blockSize之间的最小值）与minSize之间的最大值
          // return Math.max(minSize, Math.min(maxSize, blockSize));  
          long splitSize = computeSplitSize(blockSize, minSize, maxSize);

		 // bytesRemaining表示剩余的需要被分片的文件大小
          long bytesRemaining = length;
          
		 // SPLIT_SLOP默认值为1.1
          // 只要剩余的文件大小不超过分片大小的1.1倍， 则会分到一个分片中
          // 避免开两个MAP， 其中一个运行数据太小，浪费资源
          while (((double) bytesRemaining)/splitSize > SPLIT_SLOP) {
            int blkIndex = getBlockIndex(blkLocations, length-bytesRemaining);
            
            // 将新产生的Split加入到split的List中 
            splits.add(makeSplit(path, length-bytesRemaining, splitSize,
                        blkLocations[blkIndex].getHosts(),
                        blkLocations[blkIndex].getCachedHosts()));
            bytesRemaining -= splitSize;
          }

		 // 把最后剩下的放入split
          if (bytesRemaining != 0) {
            int blkIndex = getBlockIndex(blkLocations, length-bytesRemaining);
            
            // 将新产生的Split加入到split的List中 
            splits.add(makeSplit(path, length-bytesRemaining, bytesRemaining,
                       blkLocations[blkIndex].getHosts(),
                       blkLocations[blkIndex].getCachedHosts()));
          }
        } else { // not splitable
          if (LOG.isDebugEnabled()) {
            // Log only if the file is big enough to be splitted
            if (length > Math.min(file.getBlockSize(), minSize)) {
              LOG.debug("File is not splittable so no parallelization "
                  + "is possible: " + file.getPath());
            }
          }
          splits.add(makeSplit(path, 0, length, blkLocations[0].getHosts(),
                      blkLocations[0].getCachedHosts()));
        }
      } else { 
        //Create empty hosts array for zero length files
        splits.add(makeSplit(path, 0, length, new String[0]));
      }
    }
    // Save the number of input files for metrics/loadgen
    job.getConfiguration().setLong(NUM_INPUT_FILES, files.size());
    sw.stop();
    if (LOG.isDebugEnabled()) {
      LOG.debug("Total # of splits generated by getSplits: " + splits.size()
          + ", TimeTaken: " + sw.now(TimeUnit.MILLISECONDS));
    }
    return splits;
  }
```

旧版：

> Hadoop3.0.0
>
> org.apache.hadoop.mapred
>
> public abstract class FileInputFormat<K, V> implements InputFormat<K, V>
>
> getSplits(JobConf job, int numSplits)

```
   /** Splits files returned by {@link #listStatus(JobConf)} when
   * they're too big.*/ 
  public InputSplit[] getSplits(JobConf job, int numSplits)
    throws IOException {
    StopWatch sw = new StopWatch().start();
    FileStatus[] files = listStatus(job);
    
    // Save the number of input files for metrics/loadgen
    job.setLong(NUM_INPUT_FILES, files.length);
    long totalSize = 0;                           // compute total size
    for (FileStatus file: files) {                // check we have valid files
      if (file.isDirectory()) {
        throw new IOException("Not a file: "+ file.getPath());
      }
      totalSize += file.getLen();
    }

    long goalSize = totalSize / (numSplits == 0 ? 1 : numSplits);
    long minSize = Math.max(job.getLong(org.apache.hadoop.mapreduce.lib.input.
      FileInputFormat.SPLIT_MINSIZE, 1), minSplitSize);

    // generate splits
    ArrayList<FileSplit> splits = new ArrayList<FileSplit>(numSplits);
    NetworkTopology clusterMap = new NetworkTopology();
    for (FileStatus file: files) {
      Path path = file.getPath();
      long length = file.getLen();
      if (length != 0) {
        FileSystem fs = path.getFileSystem(job);
        BlockLocation[] blkLocations;
        if (file instanceof LocatedFileStatus) {
          blkLocations = ((LocatedFileStatus) file).getBlockLocations();
        } else {
          blkLocations = fs.getFileBlockLocations(file, 0, length);
        }
        if (isSplitable(fs, path)) {
          long blockSize = file.getBlockSize();
          long splitSize = computeSplitSize(goalSize, minSize, blockSize);

          long bytesRemaining = length;
          while (((double) bytesRemaining)/splitSize > SPLIT_SLOP) {
            String[][] splitHosts = getSplitHostsAndCachedHosts(blkLocations,
                length-bytesRemaining, splitSize, clusterMap);
            splits.add(makeSplit(path, length-bytesRemaining, splitSize,
                splitHosts[0], splitHosts[1]));
            bytesRemaining -= splitSize;
          }

          if (bytesRemaining != 0) {
            String[][] splitHosts = getSplitHostsAndCachedHosts(blkLocations, length
                - bytesRemaining, bytesRemaining, clusterMap);
            splits.add(makeSplit(path, length - bytesRemaining, bytesRemaining,
                splitHosts[0], splitHosts[1]));
          }
        } else {
          if (LOG.isDebugEnabled()) {
            // Log only if the file is big enough to be splitted
            if (length > Math.min(file.getBlockSize(), minSize)) {
              LOG.debug("File is not splittable so no parallelization "
                  + "is possible: " + file.getPath());
            }
          }
          String[][] splitHosts = getSplitHostsAndCachedHosts(blkLocations,0,length,clusterMap);
          splits.add(makeSplit(path, 0, length, splitHosts[0], splitHosts[1]));
        }
      } else { 
        //Create empty hosts array for zero length files
        splits.add(makeSplit(path, 0, length, new String[0]));
      }
    }
    sw.stop();
    if (LOG.isDebugEnabled()) {
      LOG.debug("Total # of splits generated by getSplits: " + splits.size()
          + ", TimeTaken: " + sw.now(TimeUnit.MILLISECONDS));
    }
    return splits.toArray(new FileSplit[splits.size()]);
  }
```



##### 方法二：createRecordReader()

生成\<key,value>键值对送入到map端

#### 类三：LineRecordReader.class

生成<key,value>键值对送入到map端

* 每一次读取一行，执行一次nextkeyvalue方法，成功生成一个\<key,value>键值对，返回true值
* 新得到的key和value存放在LineRecordReader对象中的key和value属性中
* 当nextkeyvalue()方法将所有的数据读取结束后，表示一个split中的所有数据被读取到map中

### 自定义参数命令

朴素的方式运行wordcount

```
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0.jar wordcount /wordcount/input /wordcount/output/result5  
```

指定最小分片大小运行wordcount

```
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0.jar wordcount -D mapreduce.input.fileinputformat.split.minsize=1 /wordcount/input /wordcount/output/result3  
```

指定最大分片大小运行wordcount

```
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0.jar wordcount -D mapreduce.input.fileinputformat.split.maxsize=1 /wordcount/input /wordcount/output/result4  
```

指定map数量运行wordcount

```
hadoop jar share/hadoop/mapreduce/hadoop-mapreduce-examples-2.6.0.jar wordcount -D mapreduce.job.maps=1 /wordcount/input /wordcount/output/result2  
```

### 实例

整体流程：getSplit()---->splits----->createRecordReader()----->nextKeyValue()——>\<key,value>键值对

#### 场景

File 1 : Block11, Block 12, Block 13, Block 14, Block 15 
File 2 : Block21, Block 22, Block 23 

mapreduce.job.maps=2：用户在程序中指定map tasks的个数

#### 分片处理流程

**使用org.apache.hadoop.mapreduce.lib.input.FileInputFormat.java中的getSplit()**

1. minSize=1*blockSize（默认值）
2. maxSize=9223372036854775807L byte（默认值）
3. blockSize=128MB（默认值）
4. 遍历两个文件
   1. 每个split的大小：splitSize=Math.max(minSize, Math.min(maxSize, blockSize));  
   2. 计算得到splitSize=128MB（block size）
5. 最后生成8个splits




**使用org.apache.hadoop.mapred.FileInputFormat.java中的getSplit()**

处理结果与上述相同



## **小结**

- InputSplit和Block的区别:
  - Block是个物理概念,表示一个文件可由几个Block组成
  - InputSplit是个逻辑概念, 表示Mapper中对于输入数据如何分割,从而触发map()方法调用. InputSplit可以跨Block
- 一些默认值
  - 最小字节数由mapreduce.input.fileinputformat.split.minsize设置，默认是1
  - 最大字节数由mapreduce.input.fileinputformat.split.maxsize设置，默认是Long.MAX_VALUE
  - block大小128M
- splitSize
  - split大小默认等于块大小
  - 如果自定义minsize>dfs.blockSize。则splitSize由前者决定，通常不采取split跨越多个block的做法
  - 如果自定义maxsize<dfs.blockSize，则splitSize由后者决定，相当于将一个block文件分隔为多个分片
- map任务数量final_map_num = max(compute_map_num, input_file_num)
  - 取文件数量和计算数量的最大值代表了map处理的数据是不能跨越文件，也即是最后的map数量一定会大于输入文件的数量
  - compute_map_num = min(split_num, max(default_num, goal_num))
    - split_num = total_size / split_size：我们根据用户设置的参数来计算的分片数量，只有在分片数量大于后面参数的时候才会生效
      - total_size : 输入文件整体的大小
      - split_size：由`goalSize`, `minSize`, `blockSize`这三个值决定的
        - Math.max(minSize, Math.min(goalSize, blockSize));
        - 用户期望的大小大于最小限制小于块大小的时候起作用
          * 用户期望的map数量比一个block一个split的split num多并且比用最小splitSize的split num少的时候
        - minSize大于blockSize的时候会起作用
        - 如果minSize比较小，goalSize比较大的时候则用blockSize来计算
    - default_num = total_size / block_size：默认的一个块一个map作业，成功的限制了map作业不跨块
    - goal_num = mapred.map.tasks：用户设置的map个数，只有在大于每个块一个map的时候才会发挥作用，也进一步证实了一个map工作不会垮block
  - input_file_num为输入文件数量
  - 结论
    - 如果期望map数量多：
      - 输入文件数量增多
      - 设置mapred.map.tasks 为一个较大的值，但是区间要在比一个block一个split的split num多并且比用最小splitSize的split num少
    - 如果期望map数量少：
      - 设置mapred.min.split.size 为一个较大的值
        - 通常情况下, 一个Block对应一个Split. 但如果mapreduce.input.fileinputformat.split.minsize大于文件对应的块数量或mapreduce.input.fileinputformat.split.maxsize小于文件对应的块数量, 则会导致一个Split会跨块. 这并不是一种最优设计, 因为跨块数据处理对网络IO影响比较大.
        - 所以我认为min_split_size是为了来保证用户自定义的目标大小不能过小，保证splitSize的下界，splitSize过小会导致map数量过多
  - 实验
    - 增加map数量会不会变快
    - 增加到什么程度会变快



