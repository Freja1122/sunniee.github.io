title: Hive数据导入
---

hive数据导入

<!-- more -->



hive --service hiveserver2 --hiveconf hive.server2.thrift.port=10022 &

hadoop fs -chmod 777 /tmp/hadoop-yarn/staging/anonymous/.staging/.



其有hive的hadoop-master

```
sudo docker run -itd --net=hadoop -p 50070:50070 -p 8088:8088 -p 10000:10000 --name hadoop-master --hostname hadoop-master hadoop-master:v1 &> /dev/null
```

```
sudo docker exec -it hadoop-master bash
```



```
sqoop list-tables --connect jdbc:mysql://192.168.1.119:3306/awsmovie  --username root  --password admin
```

```
sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table movie --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table actordim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table categorydim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table datedim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table director_actor --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table directordim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table formatdim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table languagedim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table movie_actor --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table movie_category --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table movie_director --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table movie_format --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table movie_language --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table movie_studio --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table movie_support --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table regiondim  --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table studiodim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver

```







错误

```
java.lang.NoClassDefFoundError: org/apache/hadoop/mapreduce/InputFormat
$HADOOP_MAPRED_HOME设置有错
```

```
出错的时候，可以设置logger级别，看下具体原因：
export HADOOP_ROOT_LOGGER=DEBUG,console
export HADOOP_ROOT_LOGGER=INFO,console
```

```
netstat -anp
```

```
sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie --username root --password admin --table movie -m 1 --hive-import --fields-terminated-by "|"
```

```
sqoop import --connect jdbc:mysql://192.168.1.119:3306/metastore --username root --password admin --table movie --fields-terminated-by "\t" --lines-terminated-by "\n" --hive-import --hive-overwrite --create-hive-table --hive-table dw_srclog.TBLS --delete-target-dir
```

```
sqoop import --connect jdbc:mysql://192.168.1.119:3306/metastore --username root --password admin --table movie --fields-terminated-by "\t" --lines-terminated-by "\n" --hive-import --hive-overwrite --create-hive-table --hive-table dw_srclog.TBLS --null-string '\\N' --null-non-string '\\N' --compression-codec "com.hadoop.compression.lzo.LzopCodec"
```

```
sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie  --username root --password admin --table movie --driver com.mysql.jdbc.Driver --hive-import --fields-terminated-by "|"
```

```
sqoop import --connect jdbc:mysql://192.168.1.119:3306/awsmovie  --username root --password admin --table movie --target-dir /user/hive/result --fields-terminated-by "\t" --driver com.mysql.jdbc.Driver
```

```

```





```
./sqoop import --connect jdbc:mysql://10.60.43.110/amazonmovie --username hive --password hivepassword --table datedim --hbase-table DATEDIM --column-family DATE_YEAR --split-by date_id
```




