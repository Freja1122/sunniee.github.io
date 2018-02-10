title: docker container
---

管理docker空间笔记

<!-- more -->

容器内存监控

```
docker stats
```



```
提交镜像
docker commit -a "Annuuser" -m "hive on master" 60a hadoop-master:v1

docker commit -a "Annuuser" -m "hive with aws data"
```

查看内存

```
free 
             total       used       free     shared    buffers     cached
Mem:       3076152    2519192     556960       6284      12784      83936
-/+ buffers/cache:    2422472     653680
Swap:      1048572     965236      83336
```

- mem: 物理内存
- swap: 虚拟内存。即可以把数据存放在硬盘上的数据
- shared: 共享内存。存在在物理内存中。
- buffers: 用于存放要输出到disk（块设备）的数据的
- cached: 存放从disk上读出的数据

```
[root@localhost ~]$ free 
             total       used       free        shared    buffers   cached
Mem:     total_mem   used_mem    free_mem   shared_mem    buffer     cache
-/+ buffers/cache:  real_used   real_free
Swap:   total_swap  used_swap   free_swap
```

| 名称         | 说明          |
| ---------- | ----------- |
| total_mem  | 物理内存总量      |
| used_mem   | 已使用的物理内存量   |
| free_mem   | 空闲的物理内存量    |
| shared_mem | 共享内存量       |
| buffer     | buffer所占内存量 |
| cache      | cache所占内存量  |
| real_used  | 实际使用的内存量    |
| real_free  | 实际空闲的内存量    |
| total_swap | swap总量      |
| used_swap  | 已使用的swap    |
| free_swap  | 空闲的swap     |

```
docker system df
查看Docker的磁盘使用情况
最后一列可回收代表没有被使用的空间
```

```
docker ps -a
查看所有container
```

```
sudo docker rm ` sudo docker ps -a -q`
删除所有容器
```

```
docker volume ls -f dangling=true
查看未挂载数据卷
```

```
docker volume rm $(docker volume ls -qf dangling=true)
删除所有未挂载卷
```

```
docker kill $(docker ps -q)
停止所有container
```

**清理 docker**

docker info  可以查看docker的信息， /var/lib/docker/devicemapper/devicemapper 目录下存放了docker的文件， 可以用du -h –max-depth=1 看文件的大小。

删除为none的镜像，可以立马回收空间:

```
docker images -a| grep none | awk '{print $3}' | xargs docker rmi
```

删除退出了的容器:

```
docker rm "docker ps -a | grep Exited | awk '{print $1 }'"
```

删除没有用的镜像。 （有容器运行的镜像不会被删除）：

```
docker rmi 'docker images -aq'
```





```
for i in $(docker images -q)
do
    docker history $i | grep -q 7923f && echo $i
done | sort -u
```



```
docker history e6
```

