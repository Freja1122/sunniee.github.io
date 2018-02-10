title: mac+docker Hadoop完全分布式搭建
---

四节点Hadoop完全分布式

<!-- more -->

## Hadoop

------

安装位置

```
/usr/local/hadoop
```

------

修改core-site.xml

> `core-site.xml`指定了`NameNode`的主机名与端口

```
<property>
        <name>hadoop.tmp.dir</name>
        <value>/opt/hadoopDir/tmp/data</value>
    </property>
    <property>
        <name>fs.defaultFS</name>
        <value>hdfs://localhost:9000</value>
</property>
```

------

修改mapred-site.xml

> `mapred-site.xml`指定了JobTracker的主机名与端口

```
<configuration>
      <property>
        <name>mapred.job.tracker</name>
        <value>localhost:8021</value>
      </property>
</configuration>
```

------

hadoop not found修改了/etc/profile

```
export $HADOOP_HOME=/usr/local/hadoop
export PATH=$HADOOP_HOME/bin:$PATH
```

------

错误：Cannot create directory /opt/hadoopDir/tmp/data/dfs/name/current

```
sudo su
sudo chmod -R a+w /usr/local/hadoop/
```

木有作用

有作用：

```
sudo hadoop namenode -format
```

------

查看端口

```
netstat -an | grep 3306
lsof -i:80
```

------

50070无法访问

看日志里面文件不存在，因为tmp文件是一个临时目录，所以要把路径写成绝对路径

所以不能太依赖博客

更改core-site.xml

```
<property>
    <name>hadoop.tmp.dir</name>
	<value>/usr/local/hadoop/tmp</value>
</property>
```

------

设置本机静态ip

```
192.168.1.2
```





## Hive

安装位置

```
/usr/local/hive
```

修改环境变量~/.zshrc

```
export HIVE_HOME="/usr/lib/hive/apache-hive-0.13.0-bin"
PATH=$PATH:$HIVE_HOME/bin
export PATH
```

```
source ~/zshrc
```

重启终端

修改hive-env.sh

修改hive-site.xml

emmm居然成功



查看hive版本

```
ls /usr/local/hive/lib/  
```



## 完全分布式

```
sudo docker rm -f hadoop-slave$i &> /dev/null
	echo "start hadoop-slave$i container..."
	sudo docker run -itd --net=hadoop --name hadoop-slave$i --hostname hadoop-slave$i kiwenlau/hadoop:1.0 &> /dev/null
```

安装无密登录

两种方案，一个是用本地的master去链接新的三个node

一个是用本地的hive去链接新的master

后者因为两个hadoop的冲突我搞不清楚，如果本地的hadoop的namenode写了远程的namenode，首先是不知道怎么写，ip好像不能直接用，我搞不懂到底是hive去链接namenode，写hadoop的路径写远程的路径，还是hadoop去写远程的namenode

另外一个方案是本地作为hadoop-master 现在的问题在于配置ssh，然后让本地可以链接两个容器，再配置ip，应该就可以起来了。试一下吧~

设置本机hostname

```

```

ssh免密登录

```
.ssh docker cp authorized_keys hadoop-slave1:/root/.ssh/authorized_keys_master
.ssh docker cp authorized_keys hadoop-slave2:/root/.ssh/authorized_keys_master
.ssh docker cp authorized_keys hadoop-slave3:/root/.ssh/authorized_keys_master
```

在三个slave .ssh上执行

```
cat authorized_keys_master  >>  authorized_keys
```

现在的问题是ping不同container里面

