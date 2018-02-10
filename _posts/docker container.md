title: Docker Container
---

怎么玩呢

<!-- more -->

```
docker start -a -i `docker ps -q -l`
docker start  $(docker ps -a -q)
```



Explanation:

`docker start` start a container (requires name or ID)
`-a` attach to container
`-i` interactive mode
`docker ps` List containers 
`-q` list only container IDs
`-l` list only last created container





```
docker start -a -i 'docker ps -a -q'
```

```
出错的时候，可以设置logger级别，看下具体原因：
export HADOOP_ROOT_LOGGER=DEBUG,console
export HADOOP_ROOT_LOGGER=INFO,console
```

