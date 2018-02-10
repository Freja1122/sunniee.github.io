title: HDFS的高可用性
---

zookeeper备用知识

<!-- more -->

Hadoop 2.x针对HDFS的高可用性问题，增加了HA的支持。在这一实现中，配置了一对活动-备用（active-standby）namenode，当活动namenode失效，备用namenode就会接管它的任务并开始服务于客户端的请求，不会有任何明显中断。架构上做了以下调整与修改：
1）namenode之间需要通过高可用的共享存储实现编辑日志的共享；当备用namenode接管工作，它将通读共享编辑日志直至末尾，以实现与活动namenode的状态同步，并继续读取由活动namenode写入的新条目；
2）datanode需要同时向两个namenode发送数据块处理报告，因为数据块的映射关系存储在内存中而不是磁盘中；

一个称为故障转移控制器的系统中有一个新实体管理着将活动namenode转移为备用namenode的转换过程。