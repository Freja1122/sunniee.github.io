title: Neo4j jdbc
---

Annuuser

<!-- more -->

Neo4j jdbc

```
端口7474
```

run neo4j docker

```
sudo docker run -itd --net=hadoop --publish=7474:7474 --publish=7687:7687 --volume=$HOME/neo4j/data:/data --name neo --hostname neo neo4j &> /dev/null
```

导入数据

```
sed -i '1i\
 id,name,movie_count' /Users/yuannnn/movie/directordim.csv
```

```
sed -i '1i\
>  actor_id(Actor):ID,name,star_count,support_count' ../import/actordim.csv
```

```
sed -i '1d' directordim.csv
```

```
echo :START_ID\(Director\),:END_ID\(Actor\),star_or_support > relation.csv
```

```
echo actor_id:ID\(Actor\),name,star_count,support_count > actorHeader.csv
```

```
echo director_id:ID\(Director\),name,movie_count > directorHeader.csv
```

```
../bin/neo4j-import --into movie10.db  --id-type string --nodes:Actor actorHeader.csv,actordim1.csv --nodes:Director directorHeader.csv,directordim1.csv --relationships:COOPERATE relation.csv,director_actor.csv
```

```
sed -i 's/[a-zA-Z ],[a-zA-Z ]/ /g' actordim.csv > actordim.csv
```

```
sed -i 's/"//g'
```

```
../bin/neo4j-import --into ../data/databases/movie.db  --id-type string --nodes:Actor actorHeader.csv,actordim1.csv --nodes:Director directorHeader.csv,directordim1.csv --relationships:COOPERATE relation.csv,director_actor.csv
```





```
../bin/neo4j-import --into ../data/databases/movie2.db  --id-type string  --nodes:Movie movie2.csv  --nodes:Actor actorHeader.csv,actordim1.csv --nodes:Director directorHeader.csv,directordim1.csv --relationships:COOPERATE relation.csv,director_actor.csv --relationships:STAR movie_actor.csv --relationships:SUPPORT movie_support.csv 
```

坑：全部都是字符串类型





查询：

导演和那些演员合作过

```
MATCH (d:Director)-[:COOPERATE]->(a:Actor)
WHERE d.director_id = "1"
RETURN a
```

一起主演的电影

```
MATCH (a1:Actor)-[:STAR]-(m:Movie)-[:STAR]-(a2:Actor)
WHERE a1.actor_id='1' AND a2.actor_id='2' 
RETURN m,a1,a2
```

一起参演的电影

```
MATCH (a1:Actor)-[:STAR]-(m:Movie)-[:SUPPORT]-(a2:Actor)
WHERE a1.actor_id='1' AND a2.actor_id='2' 
RETURN m,a1,a2


```

一起主演或者参演过的演员

```
MATCH (a1:Actor)-[:STAR|:SUPPORT]-(m:Movie)-[:STAR|:SUPPORT]-(a2:Actor)
WHERE a1.actor_id='2506' AND a2.actor_id='43091' 
RETURN m,a1,a2
```

