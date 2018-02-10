```
删除第一列
sed ‘s/[^,]*,//‘ file
```

```
for file in ./*; do sed 's/[^,]*,//' $file > $file.csv; done
```



```
load data local infile '/home/dick/BX_space/gps/output/part-r-00000.csv' into table psghot fields terminated by ',' (lon, lat);
```

```
CREATE TABLE `psghot` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `lon` DOUBLE(9,6) NOT NULL,
    `lat` DOUBLE(8,6) NOT NULL,
    PRIMARY KEY (`id`)
)
CHARSET=utf8mb4
ENGINE=InnoDB
;
```

```
CREATE TABLE `psgkmeans` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `center_id` INT(11),
    `lon` DOUBLE(9,6) NOT NULL,
    `lat` DOUBLE(8,6) NOT NULL,
    PRIMARY KEY (`id`)
)
CHARSET=utf8mb4
ENGINE=InnoDB
;
```

```
load data local infile '/home/dick/BX_space/gps/KmeansCenter.csv' into table psgkmeans fields terminated by ',' (center_id, lon, lat);
```

```
CREATE TABLE `firstpsg` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `center_id` INT(11),
    `lon` DOUBLE(9,6) NOT NULL,
    `lat` DOUBLE(8,6) NOT NULL,
    PRIMARY KEY (`id`)
)
CHARSET=utf8mb4
ENGINE=InnoDB
;
```

```
load data local infile '/home/dick/BX_space/gps/part-r-00000.csv' into table firstpsg fields terminated by ',' (center_id, lon, lat);
```



```
SELECT lon,lat, ROUND((POWER(MOD(ABS(lon - 121.367618),360),2) + POWER(ABS(lat - 31.137212),2)),6) AS distance FROM psghot ORDER BY distance LIMIT 20;
```

```
SELECT lon,lat, ROUND((POWER(MOD(ABS(lon - 121.367618),360),2) + POWER(ABS(lat - 31.137212),2)),14) AS distance FROM firstpsg ORDER BY distance LIMIT 20;
```

```
SELECT lon,lat, ROUND((POWER(MOD(ABS(lon - 121.367618),360),2) + POWER(ABS(lat - 31.137212),2)),5) AS distance FROM firstwait ORDER BY distance LIMIT 20;
```

```
select * from (SELECT lon,lat, ROUND((POWER(MOD(ABS(lon - 121.367618),360),2) + POWER(ABS(lat - 31.137212),2)),12) AS distance FROM firstwait ORDER BY distance LIMIT 50) as total where distance<0.0001;
```



```
firstwait
```

```
SELECT lon,lat,
        (POWER(MOD(ABS(lon - $lon),360),2) + POWER(ABS(lat - $lat),2)) AS distance
        FROM firstwait
        ORDER BY distance LIMIT 100
```

```
insert into itrip.psghot select * from gpsdata.psghot;
```

```
CREATE TABLE `firstwait` (
    `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    `center_id` INT(11),
    `lon` DOUBLE(9,6) NOT NULL,
    `lat` DOUBLE(8,6) NOT NULL,
    PRIMARY KEY (`id`)
)
CHARSET=utf8mb4
ENGINE=InnoDB
;
```

```
load data local infile '/home/dick/BX_space/gps/psgout/part-r-00022.csv' into table firstwait fields terminated by ',' (center_id, lon, lat);
```



```
load data local infile '/home/dick/BX_space/gps/output/part-r-00001.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00002.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00003.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00004.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00005.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00006.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00007.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00008.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00009.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00010.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00011.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00012.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00013.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00014.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00015.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00016.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00017.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00018.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00019.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00020.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00021.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00022.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00023.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00024.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00025.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00026.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00027.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00028.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00029.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00030.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00031.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00032.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00033.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00034.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00035.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00036.csv' into table psghot fields terminated by ',' (lon, lat);
load data local infile '/home/dick/BX_space/gps/output/part-r-00037.csv' into table psghot fields terminated by ',' (lon, lat);
```

```
load data local infile '/home/dick/BX_space/gps/output/part-r-00002.csv' into table psghot fields terminated by ',' (lon, lat);
```

