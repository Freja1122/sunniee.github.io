title: Phoenix数据导入
---

Annuuser

<!-- more -->

创建表

```
jdbc:phoenix:cluster01,cluster10,cluster11> 
CREATE TABLE actordim (
  actor_id Integer NOT NULL,
  name varchar(2000),
  staring_count Integer,
  supporting_count Integer,
  CONSTRAINT my_pk PRIMARY KEY (actor_id)
);
```



导入csv

```
./psql.py localhost /root/ssbt/data/actordim.csv
./psql.py localhost /root/ssbt/data/actordim.csv
./psql.py localhost /root/ssbt/data/actordim.csv
./psql.py localhost /root/ssbt/data/actordim.csv
./psql.py localhost /root/ssbt/data/actordim.csv
./psql.py localhost /root/ssbt/data/actordim.csv


./psql.py localhost /root/ssbt/data/datedim.csv
./psql.py localhost /root/ssbt/data/amazonmoviesnapshot.csv
./psql.py localhost /root/ssbt/data/actordim.csv
./psql.py localhost /root/ssbt/data/categorydim.csv
./psql.py localhost /root/ssbt/data1/director_actor.csv
./psql.py localhost /root/ssbt/data/directordim.csv
./psql.py localhost /root/ssbt/data/formatdim.csv
./psql.py localhost /root/ssbt/data/languagebridge.csv
./psql.py localhost /root/ssbt/data/languagedim.csv
./psql.py localhost /root/ssbt/data/moviecategorybridge.csv
./psql.py localhost /root/ssbt/data/movieformatbridge.csv
./psql.py localhost /root/ssbt/data/studiodim.csv

./psql.py localhost /root/ssbt/data/movietoactorbridge.csv
./psql.py localhost /root/ssbt/data/movietodirectorbridge.csv
./psql.py localhost /root/ssbt/data/movietostudiobridge.csv
./psql.py localhost /root/ssbt/data/movietosupportingactorbridge.csv
./psql.py localhost /root/ssbt/data/studiodim.csv
```



根据年做一个分组排序

```
select date_year,count(1) as num from datedim group by date_year order by num desc;
 DATE_YEAR  | NUM  |
+------------+------+
| 2009       | 324  |
| 2008       | 321  |
| 2006       | 320  |
| 2007       | 319  |
| 2005       | 314  |
| 2004       | 312  |
| 2010       | 308  |
| 2003       | 299  |
| 2011       | 294  |
| 2002       | 288  |
| 2000       | 275  |
| 2001       | 271  |
| 2012       | 261  |
| 1999       | 253  |
+------------+------+
86 rows selected (0.226 seconds)
```



查看平均值

```
select avg(Staring_count) from actordim;
+---------------------+
| AVG(STARING_COUNT)  |
+---------------------+
| 5.3403              |
+---------------------+
1 row selected (0.87 seconds)
```

建表优化；

```
创建表指定的Salting
在hbase的rowkey的byte数组的第一个字节位置设定一个系统生成的byte值，这个byte值由主键生成rowkey的byte数组做一个哈希算法。
Salting之后可以把数据分布到不同的region上，有利于phoenix并发的读写操作

创表末尾加上
SALT_BUCKETS=16
```

```
Pre-split(Hbase表预分区)
在建phoenix时，可以精确的指定要根据什么值来做预分区，极大提高phoenix批加载数据速度

在表末尾加上split on()
```

```
创建表使用多个列族

每个列族在单独的文件中，如果查询使用选定的列只存在于一个列族中，将极大的提高读取数据的性能

```

```
创建表使用压缩
GZip，Snappy，Lzo等等提高读写效率

在表后面加上COMPRESSION='GZ'

GZIP压缩适合冷数据场景，相比较Snappy和LZO压缩，压缩率更高，但是CPU消耗的也更多。
Snappy压缩出现之前谷歌默认使用的是LZO，但是Snappy出现之后在性能上更加出色，因此Snappy成了默认压缩方式。
```



查看执行sql时是否使用了二级索引

```
explain select
```

并行调优

- 拆分表分配到不同的region中，减少查询的等待时间
- 客户端通过phoenix.query.targetConcurrency 和 phoenix.query.maxConcurrency 来控制查询如何来拆分扫描
- Phoenix会将一个聚合查询分成多个Scan，然后将这些Scan分配给phoenix自定义的hbase协处理器，这些协处理器可以在服务器端并行执行来提高查询性能
- HBase表分区监控工具

​		 http://www.sentric.ch/blog/hbase-split-visualisation-introducing-hannibal