title: Hive JDBC
---

hive jdbc

<!-- more -->

使用jdbc连接hive

开启hive远程连接

```
hiveserver2
```

hadoop中允许访问

```
<property>
<name>hadoop.root.server.hosts</name>
<value>*</value>
</property>
<property>
<name>hadoop.root.server.groups</name>
<value>*</value>
</property>
```

实例代码

```

```

用户名和密码是hive对应的mysql数据库中的用户名和密码

Permission denied: user=hadoop-user2, access=EXECUTE, inode="tmp":hadoop-user1:supergroup:rw-rw-rw-

```
fs -chmod 777  /tmp/hadoop-yarn/staging/root
```

内存不够了

查看内存使用情况

```
free -m
```

log不上去查看日志

```
/tmp/hivelog/hive.log
```

更改mysql连接ip