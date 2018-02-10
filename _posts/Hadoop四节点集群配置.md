title: Hadoop四节点集群配置
---

Hadoop四节点集群配置笔记

<!-- more -->

基于docker搭建hadoop四节点集群

1. 下载Docker镜像

   ```
   sudo docker pull kiwenlau/hadoop:1.0
   ```

2. 下载Github仓库

   ```
   git clone https://github.com/kiwenlau/hadoop-cluster-docker
   ```

3. 创建Hadoop网络

   ```
   sudo docker network create --driver=bridge hadoop
   ```

   安装 Docker 时，它会自动创建 3 个网络。可以使用 **docker network ls**命令列出这些网络。

   ```
   $ docker network ls 
   NETWORK ID          NAME                DRIVER 
   7fca4eb8c647        bridge              bridge 
   9f904ee27bf5        none                null 
   cf03ee007fb4        host                host
   ```

   - bridge 网络表示所有 Docker 安装中都存在的 docker0 网络。除非使用 **docker run --net=<NETWORK>**选项另行指定，否则 Docker 守护进程默认情况下会将容器连接到此网络。在主机上使用 **ifconfig**命令，可以看到此网桥是主机的网络堆栈的一部分。
   - none 网络在一个特定于容器的网络堆栈上添加了一个容器。该容器缺少网络接口。
   - host 网络在主机网络堆栈上添加一个容器。您可以发现，容器中的网络配置与主机相同。

   这里创建了一个自定义bridge网络，在网络中的容器仅能在网络内通信，不能跨网络进行通信，一个连接到多个网络的容器可以与每个网络的成员容器进行通信。当一个容器连接到多个网络时，外部连接通过第一个（按词典顺序）非内部网络提供。

4. 重构Docker镜像

   ```
   cd hadoop-cluster-docker
   ./resize-cluster.sh 4
   ```

5. 启动Docker容器

   ```
   ./start-container.sh 4
   ```

   启动以后就进入了hadoop-master容器的/root目录

6. 运行Hadoop

   ```
   ./start-hadoop.sh
   ```

7. 运行wordcount

   ```
   ./run-wordcount.sh
   ```


8. 查看网页管理地址

   ```
   NameNode: http://localhost:50070/
   ResourceManager: http://localhost:8088/
   ```

9. hadoop安装位置

   ```
   /usr/local/hadoop/
   /usr/local/hadoop/etc/hadoop
   ```

   ​

