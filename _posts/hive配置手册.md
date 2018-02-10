title: hive配置
---

hive连接非localhdfs

<!-- more -->

起hive

```
sudo docker run -d --name hive-master -P -h hadoop-master --net=hadoop teradatalabs/cdh5-hive 
```

hive配置文件路径

```
/etc/hive/conf
/etc/hadoop
/usr/lib/hadoop
```

hadoop配置文件路径

```
/etc/hadoop/conf
```

