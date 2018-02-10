title: Hive 本地模式
---

hive本地模式

<!-- more -->

**1.针对MR中单个步骤的优化**

A.**Map阶段的优化(Map phase) Map阶段的优化，主要是确定合适的Map数。** 

* Mapred.min.split.size指的是数据的最小分割单元大小。 
* Mapred.max.split.size指的是数据的最大分割单元大小。 
* dfs.block.size指的是HDFS设置的数据块大小。 

如果MAP执行时间过长(分钟级),那么可以增加MAP 的数量来减少单个MAP的执行时间。如果单个MAP的执行时间较低(如10~20s)，那么没有必要进行MAP数优化

B. **Reduce 阶段的优化(Reduce phase)。**

Mapred.Reduce.tasks参数从而直接指定Reduce的个数.

Reduce的数量公式为 num_Reduce_tasks = min[${Hive.exec.Reducers.max},(${input.size} / ${ Hive.exec.Reducers.bytes.per.Reducer})] 也可根据Hive.exec.Reducers.bytes.per.Reducer(默认1G)来控制Reduce的数量。

C.Map与Reduce之间的优化(Spill， copy， Sort phase) Map phase和Reduce phase之间主要有3道工序。首先要把Map输出的结果进行排序后做成中间文件， 其次这个中间文件就能分发到各个Reduce，最后Reduce端在执行Reduce phase之前把收集到的排序子文件合并成一个排序文件。 这个部分可以调的参数挺多，但是一般都是不要调整的，不必重点关注。 (MAP -排序->中间文件-合并->Reduce)

D.Spill 与 Sort。调整io.Sort.mb和io.Sort.factor。 在Spill阶段，由于内存不够，数据可能没办法在内存中一次性排序完成，那么就只能把局部排序的文件先保存到磁盘上，这个动作叫Spill， 然后Spill出来的多个文件可以在最后进行merge。如果发生Spill，可以通过设置io.Sort.mb来增大Mapper输出buffer的大小，避免Spill的发生。 另外合并时可以通过设置io.Sort.factor来使得一次性能够合并更多的数据。调试参数的时候，一个要看Spill的时间成本，一个要看merge的时间成本， 还需要注意不要撑爆内存（io.Sort.mb是算在Map的内存里面的）。Reduce端的merge也是一样可以用io.Sort.factor。 一般情况下这两个参数很少需要调整，除非很明确知道这个地方是瓶颈。

E.Copy。调整Mapred.Reduce.slowstart.completed.Maps copy阶段是把文件从Map端copy到Reduce端。默认情况下在5%的Map完成的情况下Reduce就开始启动copy，这个有时候是很浪费资源的， 因为Reduce一旦启动就被占用，一直等到Map全部完成，收集到所有数据才可以进行后面的动作， 所以我们可以等比较多的Map完成之后再启动Reduce流程，这个比例可以通Mapred.Reduce.slowstart.completed.Maps去调整， 他的默认值就是5%。如果觉得这么做会减慢Reduce端copy的进度，可以把copy过程的线程增大。 tasktracker.http.threads可以决定作为server端的Map用于提供数据传输服务的线程， Mapred.Reduce.parallel.copies可以决定作为client端的Reduce同时从Map端拉取数据的并行度（一次同时从多少个Map拉数据）， 修改参数的时候这两个注意协调一下，server端能处理client端的请求即可。

**2.针对MR全局的优化**

A.JOB执行模式。Hadoop的Map Reduce Job可以有3种模式执行， 即本地模式，伪分布式，还有真正的分布式。启动分布式Job会消耗大量资源，而真正执行计算的时间反而非常少。

 这个时候就应该使用本地模式执行mr Job，这样执行的时候不会启动分布式Job，执行速度就会快很多。 

一般来说启动分布式Job，无论多小的数据量，执行时间一般不会少于20s，而使用本地mr模式，10秒左右就能出结果。

设置执行模式的主要参数有三个：

* Hive.exec.mode.local.auto，把他设为true就能够自动开启local mr模式
* 但是这还不足以启动local mr，输入的文件数量和数据量大小必须要控制
  * 两个参数分别为Hive.exec.mode.local.auto.tasks.max和Hive.exec.mode.local.auto.inputbytes.max， 默认值分别为4和128MB
  * Map处理的文件数不超过4个
  * 总大小小于128MB就启用local mr模式

B.JVM重用。 正常情况下，MapReduce启动的JVM在完成一个task之后就退出了，但是如果任务花费时间很短， 又要多次启动JVM的情况下（比如对很大数据量进行计数操作）， JVM的启动时间就会变成一个比较大的overhead。在这种情况下，可以使用jvm重用的参数： set Mapred.Job.reuse.jvm.num.tasks = 5;

C.Join算法。一般可忽略该优化方法 处理分布式join，一般有两种方法: replication join：把其中一个表复制到所有节点，这样另一个表在每个节点上面的分片就可以跟这个完整的表join了； repartition join：把两份数据按照join key进行hash重分布，让每个节点处理hash值相同的join key数据，也就是做局部的join。 这两种方式在M/R Job中分别对应了Map side join和Reduce side join。在一些MPP DB中，数据可以按照某列字段预先进行hash分布， 这样在跟这个表以这个字段为join key进行join的时候，该表肯定不需要做数据重分布了，这种功能是以HDFS作为底层文件系统的Hive所没有的。 在默认情况下，Hive的join策略是进行Reduce side join。当两个表中有一个是小表的时候，就可以考虑用Map join了，因为小表复制的代价会好过大表Shuffle的代价。 使用Map join的配置方法有两种，一种直接在sql中写hint，语法是/*+MapJOIN (tbl)*/，其中tbl就是你想要做replication的表。 另一种方法是设置Hive.auto.convert.join = true，这样Hive会自动判断当前的join操作是否合适做Map join，主要是找join的两个表中有没有小表。 至于多大的表算小表，则是由Hive.smalltable.filesize决定，默认25MB。 但是有的时候，没有一个表足够小到能够放进内存，但是还是想用Map join怎么办？ 这个时候就要用到bucket Map join。其方法是两个join表在join key上都做hash bucket，并且把你打算复制的那个（相对）小表的bucket数设置为大表的倍数。 这样数据就会按照join key做hash bucket。小表依然复制到所有节点，Map join的时候，小表的每一组bucket加载成hashtable， 与对应的一个大表bucket做局部join，这样每次只需要加载部分hashtable就可以了。 然后在两个表的join key都具有唯一性的时候（也就是可做主键），还可以进一步做Sort merge bucket Map join。 做法还是两边要做hash bucket，而且每个bucket内部要进行排序。这样一来当两边bucket要做局部join的时候， 只需要用类似merge Sort算法中的merge操作一样把两个bucket顺序遍历一遍即可完成，这样甚至都不用把一个bucket完整的加载成hashtable，这对性能的提升会有很大帮助。

D.数据倾斜。 所谓数据倾斜，说的是由于数据分布不均匀，个别值集中占据大部分数据量，加上Hadoop的计算模式，导致计算资源不均匀引起性能下降。 假设网站访问日志中会记录用户的user_id，并且对于注册用户使用其用户表的user_id，对于非注册用户使用一个user_id=0代表。 那么鉴于大多数用户是非注册用户（只看不写），所以user_id=0占据了绝大多数。而如果进行计算的时候如果以user_id作为group by的维度或者是join key， 那么个别Reduce会收到比其他Reduce多得多的数据——因为它要接收所有user_id=0的记录进行处理，使得其处理效果会非常差，其他Reduce都跑完很久了它还在运行。 倾斜分成group by造成的倾斜和join造成的倾斜，需要分开看。 group by造成的倾斜有两个参数可以解决，一个是Hive.Map.aggr，默认值已经为true，意思是会做Map端的combiner。所以如果你的group by查询只是做count(*)的话，其实是看不出倾斜效果的，但是如果你做的是count(distinct)，那么还是会看出一点倾斜效果。另一个参数是Hive.groupby. skewindata。这个参数的意思是做Reduce操作的时候，拿到的key并不是所有相同值给同一个Reduce，而是随机分发，然后Reduce做聚合，做完之后再做一轮MR，拿前面聚合过的数据再算结果。所以这个参数其实跟Hive.Map.aggr做的是类似的事情，只是拿到Reduce端来做，而且要额外启动一轮Job，所以其实不怎么推荐用，效果不明显。 join造成的倾斜，就比如上面描述的网站访问日志和用户表两个表join：select a.* from logs a join users b on a。user_id = b.user_id; Hive给出的解决方案叫skew join，其原理把这种user_id = 0的特殊值先不在Reduce端计算掉，而是先写入hdfs，然后启动一轮Map join专门做这个特殊值的计算，期望能提高计算这部分值的处理速度。当然你要告诉Hive这个join是个skew join，即： set Hive.optimize.skewjoin = true;

**3.针对整个查询（多MR Job）的优化**

A.Job间并行。多用UNION ALL 首先，在Hive生成的多个Job中，在有些情况下Job之间是可以并行的，典型的就是子查询。当需要执行多个子查询union all或者join操作的时候，Job间并行就可以使用了。比如下面的代码就是一个可以并行的场景示意：select * from ( select count(*) from logs where log_date = 20130801 and item_id = 1 union all select count(*) from logs where log_date = 20130802 and item_id = 2 union all select count(*) from logs where log_date = 20130803 and item_id = 3 )t。设置Job间并行的参数是Hive.exec.parallel，将其设为true即可。默认的并行度为8，也就是最多允许sql中8个Job并行。如果想要更高的并行度，可以通过Hive.exec.parallel. thread.number参数进行设置，但要避免设置过大而占用过多资源。

B.减少JOB数。SQL优化 另外在实际开发过程中也发现，一些实现思路会导致生成多余的Job而显得不够高效。比如这个需求：查询某网站日志中访问过页面a和页面b的用户数量。低效的思路是面向明细的，先取出看过页面a的用户，再取出看过页面b的用户，然后取交集，代码如下： select count(*) from (select distinct user_id from logs where page_name = ‘a’) a join (select distinct user_id from logs where blog_owner = ‘b’) b on a.user_id = b.user_id; 这样一来，就要产生2个求子查询的Job，一个用于关联的Job，还有一个计数的Job，一共有4个Job。 但是我们直接用面向统计的方法去计算的话（也就是用group by替代join），则会更加符合M/R的模式，而且生成了一个完全不带子查询的sql，只需要用一个Job就能跑完： select count(*) from logs group by user_id having (count(case when page_name = ‘a’ then 1 end) > 0 and count(case when page_name = ‘b’ then 1 end) > 0) 第一种查询方法符合思考问题的直觉，是工程师和分析师在实际查数据中最先想到的写法，但是如果在目前Hive的query planner不是那么智能的情况下，想要更加快速的跑出结果，懂一点工具的内部机理也是必须的。



### 合理控制mappers和reducers数

#### Mappers数

Mappers过多情况下：

l  Map阶段输出文件太小，产生大量小文件

l  初始化和创建Mappers进程的开销很大

 

Mappers太少情况下：

l  文件处理或查询并发度小，Job执行时间过长

l  大量作业时，容易堵塞集群

**两种方式控制Mapper数：即减少mapper数和增加mapper数**

l  减少mapper数可以通过合并小文件来实现，这点是对文件源处理。

l  增加mapper数可以通过控制上一个job的reducer数来控制（比如：一个sql中多表join会产生多个Map-Reduce任务）。

比如增大mapred.reduce.tasks数值。

**下面介绍map端的几个控制参数：**

l  set mapred.map.tasks=10;

此参数直接设置，有时并不生效，其实它是hadoop的参考数值。

 

下面我说一下直接设置不生效的原因：

**默认mapper个数计算为：**

\# total_size为输入文件总大小，dfs_block_size为HDFS设置的数据块大小(一般为128MB)

default_mapper_num=total_size/dfs_block_size;

 

我们通过参数直接设置的期望mapper个数为：

\# setmapred.map.tasks=10;

\#这个参数设置只有在大于default_mapper_num的时候，才会生效

goal_mapper_num=mapred.map.tasks;

 

下面我们来计算一下，经过map端split处理的文件大小和个数：

\#mapred.min.split.size(数据的最小分割单元大小)

\#mapred.min.split.size 设置每个task处理的文件大小，只有在大于dfs_block_size值时才会生效

split_size=max(mapred.min.split.size,dfs_block_size);

split_num=total_size/split_size;

** **

**最终计算的mapper个数：**

**compute_mapper_num=min(split_num,max(default_mapper_num,goal_mapper_num))**

**        **

**         总结：**

**         其实根据我自己的实践，调整mapper数之前，我们一定要确定处理的文件大概大小以及文件的存在形式(很多小文件，还是单个大文件以及其他形式)，然后合理地调整mapred.min.split.size和mapred.max.split.size的值。**

**比如，如果想减少mapper个数，则需要增大mapred.min.split.size的值(因为dfs_block_size一般不变)。**

 

​         示例：

情况1：输入文件很大，但不是小文件组成的

增大mapred.min.split.size的值。

 

情况2：输入文件数量很多，且都是小文件，同时每个文件都小于dfs_block_size。

这种情况下通过增大mapred.min.split.size不可行。

原因：增大mapred.min.split.size会造成小文件在网络上来回传输，造成网络负载很大。

解决办法：需要设置下面参数，使用合并小文件方法，将多个输入文件合并后送给mapper处理，从而减少mapper的数量。

**set hive.input.format=org.apache.hadoop.hive.ql.io.CombineHiveInputFormat;** 

示例：

情况1：输入文件很大，但不是小文件组成的

增大mapred.min.split.size的值。

 

情况2：输入文件数量很多，且都是小文件，同时每个文件都小于dfs_block_size。

这种情况下通过增大mapred.min.split.size不可行。

原因：增大mapred.min.split.size会造成小文件在网络上来回传输，造成网络负载很大。

 

解决办法：需要设置下面参数，使用合并小文件方法，将多个输入文件合并后送给mapper处理，从而减少mapper的数量。

**set hive.input.format=org.apache.hadoop.hive.ql.io.CombineHiveInputFormat;**





l  推测执行：

**set mapred.map.tasks.speculative.execution=true;**

(reduce端也有类似的参数：mapred.reduce.tasks.speculative.execution)

所谓的推测执行，就是当所有的task都开始运行之后，Job Tracker会统计所有任务的平均进度，如果某个task所在的task node节点配置比较低或者CPU负载很大，导致任务执行比总体任务的平均执行要慢，此时Job Tracker就会在其他节点启动一个新的任务(duplicatetask)，原有任务和新任务哪个先执行完就把其他节点的另外一个任务kill掉。这也是我们经常在Job Tracker页面看到，虽然任务执行成功了，但是发现一些任务被kill掉了，就是这个原因。

 



