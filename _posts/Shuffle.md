title: First Meet
---

Annuuser

<!-- more -->

```
./sqoop list-tables --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword
```



```
./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table amazonmoviesnapshot --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table actordim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans 

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table categorydim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/awdata --username hive --password hivepassword --table director_actor --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table datedim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table directordim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table formatdim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table languagedim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table movietoactorbridge --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table moviecategorybridge --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table movietodirectorbridge --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table movieformatbridge --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table languagebridge --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table movietostudiobridge --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table movietosupportingactorbridge --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table regiondim  --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans

./sqoop import --connect jdbc:mysql://10.60.43.110:3306/amazonmovie --username hive --password hivepassword --table studiodim --hive-import --fields-terminated-by ',' --hive-overwrite -m 1 --driver com.mysql.jdbc.Driver --hive-database awdatans


```

