title: 性能记录
---

Annuuser

<!-- more -->

```
select * from languagedim;

Time taken: 4.398 seconds, Fetched: 749 row(s)
```



```
select * from datedim;

Time taken: 5.004 seconds, Fetched: 7279 row(s)
```



```
select * from datedim where year = 2001;

Time taken: 22.422 seconds, Fetched: 271 row(s)
```

执行查询

```
SELECT COUNT(*) FROM datedim AS da JOIN amazonmoviesnapshot AS sh ON da.date_id = sh.date_id WHERE date_year = 2001
```

查询时间

```
22.383
```

创建索引：

```
create index time_idx on table datedim(date_id) 
as 'org.apache.hadoop.hive.ql.index.compact.CompactIndexHandler'
with deferred rebuild;

alter index time_idx on datedim rebuild;

create index time_year_idx on table datedim(date_year) 
as 'org.apache.hadoop.hive.ql.index.compact.CompactIndexHandler'
with deferred rebuild;

alter index time_year_idx on datedim rebuild;
```

查询时间

```
21.738
```

