title: docker port
---

Annuuser

<!-- more -->

查看ip

```
docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' container
```

查看端口映射

```
docker port container
```

给运行的容器添加端口映射

方法1：

获得容器IP

```
docker inspect `container_name` | grep IPAddress
```

端口转发

```
iptables -t nat -A  DOCKER -p tcp --dport 8001 -j DNAT --to-destination 172.17.0.19:8000
```

方法2：

提交一个运行中的容器为镜像

```
docker commit containerid foo/live
```

运行镜像并添加端口

```
docker run -d -p 8000:80  foo/live /bin/bash
```

