title: hive mysql hbase性能对比
---

Annuuser

<!-- more -->

getMovieCountByYear()

```

SELECT COUNT(*) FROM datedim AS date JOIN movie AS mv ON date.date_id = mv.date_id WHERE year = 2002;

HBASW:1.984
HIVE:23.625
MYSQL:0.652


{"databaseType":"MYSQL","quantity":9963,"year":"2001","queryTime":"652ms"}
{"databaseType":"HIVE","quantity":8391,"year":"2001","queryTime":"22075ms"}
{"databaseType":"HBASE","quantity":271,"year":"2001","queryTime":"3730ms"}
```



```
getMovieCountBySeasonYear()

{"databaseType":"MYSQL","Autumn":48882,"Winter":46804,"year":"0","queryTime":"612ms","Summer":46198,"Spring":47941}
{"databaseType":"HIVE","Autumn":42719,"Winter":40826,"year":"0","queryTime":"85843ms","Summer":40340,"Spring":41896}
{"databaseType":"HBASE","Autumn":48882,"Winter":46804,"year":"0","queryTime":"6329ms","Summer":46198,"Spring":47941}
```



```
getMovieCountByYearMonth()

dataty
{"June":748,"Sept":860,"Oct":1019,"Feb":723,"Apr":741,"Aug":967,"Dec":579,"May":1284,"year":"2001","databaseType":"MYSQL","Jan":820,"queryTime":"833ms","July":711}
{"June":622,"Oct":827,"Feb":638,"Apr":618,"Dec":503,"May":986,"year":"2001","databaseType":"HIVE","Sept":761,"Aug":859,"Jan":703,"queryTime":"211682ms","July":628}
```



```
getMovieCountByYearSeasonDay()

{"Tue_Spring":28,"year":"2001","Wed_Winter":21,"Sat_Autumn":1425,"Tue_Autumn":74,"Wed_Spring":655,"Fri_Summer":1276,"Sun_Summer":63,"Fri_Autumn":811,"Sat_Summer":1271,"Mon_Spring":101,"Wed_Summer":29,"Sat_Winter":1376,"Sun_Winter":141,"Tue_Summer":14,"Sun_Spring":34,"Fri_Winter":798,"Mon_Autumn":90,"Sun_Autumn":94,"Sat_Spring":1209,"Wed_Autumn":9,"Fri_Spring":193,"Tue_Winter":26,"queryTime":"1153ms","Mon_Summer":65,"Mon_Winter":34}

{"Tue_Spring":27,"year":"2001","Wed_Winter":15,"Sat_Autumn":1247,"Tue_Autumn":72,"Wed_Spring":574,"Fri_Summer":1054,"Sun_Summer":48,"Fri_Autumn":733,"Sat_Summer":977,"Mon_Spring":31,"Wed_Summer":22,"Sat_Winter":1146,"Sun_Winter":123,"Tue_Summer":12,"Sun_Spring":32,"Fri_Winter":683,"Mon_Autumn":77,"databaseType":"HIVE","Sun_Autumn":79,"Sat_Spring":1029,"Wed_Autumn":9,"Fri_Spring":174,"Tue_Winter":22,"queryTime":"506622ms","Mon_Summer":61,"Mon_Winter":26}
```

```
listByRanking()

{"queryTime":"1228ms"}
"queryTime":"18984ms"
```



```
{"movies":[{"snapshot_id":"235505","ranking":"13","title":"Harry Potter: Complete 8-Film Collection [Blu-ray]"},{"snapshot_id":"235005","ranking":"18","title":"Harry Potter: The Complete 8-Film Collection"},{"snapshot_id":"198202","ranking":"787","title":"Harry Potter and the Half-Blood Prince (Widescreen Edition)"},{"snapshot_id":"160386","ranking":"1153","title":"Harry Potter and the Order of the Phoenix (Widescreen Edition)"},{"snapshot_id":"132776","ranking":"2630","title":"Harry Potter and the Goblet of Fire (Single-Disc Widescreen Edition)"},{"snapshot_id":"160882","ranking":"3642","title":"Harry Potter and the Prisoner of Azkaban (Full Screen Edition)"},{"snapshot_id":"160884","ranking":"4687","title":"Harry Potter and the Order of the Phoenix (Full-Screen Edition)"},{"snapshot_id":"48698","ranking":"5415","title":"Harry Potter and the Sorcerers Stone (Two-Disc Special Widescreen Edition)"},{"snapshot_id":"133275","ranking":"7049","title":"Harry Potter and the Goblet of Fire (Full Screen Edition) (Harry Potter 4)"},{"snapshot_id":"187779","ranking":"7587","title":"Harry Potter and the Deathly Hallows - Part 2 [Blu-ray]"},{"snapshot_id":"189775","ranking":"11002","title":"Harry Potter and the Deathly Hallows, Part 2"},{"snapshot_id":"77547","ranking":"14158","title":"Harry Potter and the Sorcerers Stone (Full Screen Edition) (Harry Potter 1)"},{"snapshot_id":"162382","ranking":"15151","title":"Harry Potter Interactive DVD Game - Hogwarts Challenge"},{"snapshot_id":"113070","ranking":"15287","title":"Harry Potter and the Prisoner of Azkaban"},{"snapshot_id":"189275","ranking":"15730","title":"Harry Potter and the Deathly Hallows, Part 1 [Blu-ray]"},{"snapshot_id":"167036","ranking":"16271","title":"Harry Potter and the Half-Blood Prince [Blu-ray]"},{"snapshot_id":"69232","ranking":"18015","title":"Harry Potter and the Prisoner of Azkaban (Two-Disc Widescreen Edition)"},{"snapshot_id":"89828","ranking":"19642","title":"Harry Potter and the Chamber of Secrets (Full-Screen Edition)"},{"snapshot_id":"251185","ranking":"22012","title":"Harry Potter & The Deathly Hallows Part 1 (Blu-ray 3D)"},{"snapshot_id":"87829","ranking":"22960","title":"Harry Potter and the Chamber of Secrets (Widescreen Edition)"},{"snapshot_id":"198694","ranking":"26445","title":"Harry Potter and the Half-Blood Prince (Single-Disc Full Screen Edition)"},{"snapshot_id":"179455","ranking":"27440","title":"Harry Potter Years 1-5 [Blu-ray]"},{"snapshot_id":"210824","ranking":"31853","title":"Harry Potter and the Prisoner of Azkaban (Three-Disc Ultimate Edition) [Blu-ray]"},{"snapshot_id":"143056","ranking":"37507","title":"Harry Potter and the Sorcerers Stone [HD DVD]"},{"snapshot_id":"250291","ranking":"41225","title":"Harry Potter & The Deathly Hallows: Part 2 (Blu-ray 3D)"},{"snapshot_id":"235995","ranking":"43038","title":"Harry Potter and the Deathly Hallows, Part 2 (Movie-Only Edition + UltraViolet Digital Copy) [Blu-ray]"},{"snapshot_id":"89337","ranking":"44440","title":"Harry Potter and the Chamber of Secrets"},{"snapshot_id":"244405","ranking":"46039","title":"Harry Potter Wizards Collection (Blu-ray / DVD Combo)"},{"snapshot_id":"162332","ranking":"51554","title":"Harry Potter and the Chamber of Secrets [HD DVD]"},{"snapshot_id":"211323","ranking":"54070","title":"Harry Potter and the Goblet of Fire (Three-Disc Ultimate Edition) [Blu-ray]"},{"snapshot_id":"165038","ranking":"54389","title":"Harry Potter and the Half-Blood Prince"},{"snapshot_id":"160387","ranking":"61473","title":"Harry Potter and the Order of the Phoenix [Blu-ray]"},{"snapshot_id":"112571","ranking":"61697","title":"Harry Potter And The Prisoner Of Azkaban [VHS]"},{"snapshot_id":"238454","ranking":"61854","title":"Harry Potter & Deathly Hallows Part 2 [Blu-ray]"},{"snapshot_id":"251684","ranking":"64294","title":"Harry Potter Double Feature: The Deathly Hallows Part 1 & 2 [Blu-ray]"},{"snapshot_id":"238925","ranking":"66591","title":"Harry Potter and the Deathly Hallows, Part 1 3D (Blu-ray 3D Combo Pack with Blu-ray 3D, Blu-ray, DVD & Digital Copy) [Blu-ray 3D]"},{"snapshot_id":"224183","ranking":"69488","title":"Harry Potter Years 1-7 Part 1 Gift Set"},{"snapshot_id":"48197","ranking":"72145","title":"Harry Potter & Sorcerers Stone [VHS]"},{"snapshot_id":"177267","ranking":"73633","title":"Biography: Harry Potter Kids"},{"snapshot_id":"250550","ranking":"75719","title":"Harry Potter and the Deathly Hallows: Parts 1 and 2 (2-Movie Ultimate Edition) [Blu-ray]"},{"snapshot_id":"246260","ranking":"77658","title":"Harry Potter and the Deathly Hallows, Part 2 (Movie-Only Edition UltraViolet Digital Copy) [Blu-ray]"},{"snapshot_id":"132659","ranking":"80540","title":"Harry Potter and the Sorcerers Stone [UMD for PSP]"},{"snapshot_id":"68773","ranking":"80990","title":"Harry Potter and the Order of the Phoenix (Two-Disc Special Edition)"},{"snapshot_id":"228025","ranking":"82212","title":"Harry Potter and the Chamber of Secrets (Blu-ray DVD Digital Copy Combo Pack)"},{"snapshot_id":"134150","ranking":"82264","title":"Harry Potter and the Goblet of Fire [HD DVD]"},{"snapshot_id":"225885","ranking":"90952","title":"Harry Potter and the Order of the Phoenix (Two-Disc Ultimate Edition) [Blu-ray]"},{"snapshot_id":"223684","ranking":"92595","title":"Harry Potter Years 1-7 Part 1 Gift Set [Blu-ray]"},{"snapshot_id":"177963","ranking":"93940","title":"Harry Potter: Years One-Five (Full Screen Edition)"},{"snapshot_id":"199734","ranking":"95670","title":"Harry Potter Years 1-6 Giftset [Blu-ray]"},{"snapshot_id":"113074","ranking":"105846","title":"Harry Potter - Years 1-3 Collection (Harry Potter and the Sorcerers Stone/Harry Potter and the Chamber of Secrets/Harry Potter and the Prisoner of Azkaban) (6-Disc DVD Set) (Full Screen Edition)"},{"snapshot_id":"226882","ranking":"107230","title":"Harry Potter and the Half-Blood Prince (Two-Disc Ultimate Edition) [Blu-ray]"},{"snapshot_id":"238951","ranking":"116576","title":"Harry Potter And The Deathly Hallows, Part 2 (Two-Disc Special Edition)"},{"snapshot_id":"89826","ranking":"118433","title":"Harry Potter and the Chamber of Secrets [VHS]"},{"snapshot_id":"177463","ranking":"118514","title":"Harry Potter Years 1-5 (Widescreen Edition)"},{"snapshot_id":"226385","ranking":"120661","title":"Harry Potter and the Half-Blood Prince (Three-Disc Ultimate Edition)"},{"snapshot_id":"226384","ranking":"121887","title":"Harry Potter and the Order of the Phoenix (Three-Disc Ultimate Edition)"},{"snapshot_id":"228033","ranking":"128498","title":"Harry Potter and the Deathly Hallows, Part 1 (Four-Disc Blu-ray Deluxe Edition)"},{"snapshot_id":"229015","ranking":"128758","title":"Harry Potter and the Half-Blood Prince LIMITED EDITION Includes: Blu-ray / DVD / Digital Copy"},{"snapshot_id":"134293","ranking":"134942","title":"Harry Potter: Years 1-4 (Harry Potter and the Sorcerers Stone / Chamber of Secrets / Prisoner of Azkaban / Goblet of Fire)"},{"snapshot_id":"133773","ranking":"135964","title":"Harry Potter and the Goblet of Fire [UMD for PSP]"},{"snapshot_id":"203170","ranking":"152266","title":"Harry Potter & Half-Blood Prince [Blu-ray]"},{"snapshot_id":"120939","ranking":"179027","title":"Harry Potter and the Sorcerers Stone (Mini DVD) (Harry Potter 1)"},{"snapshot_id":"203175","ranking":"188273","title":"Harry Potter and the Sorcerers Stone (Extended Version)"},{"snapshot_id":"114121","ranking":"199286","title":"Harry Potter and the Prisoner of Azkaban (2 Disc Edition) [2004] [DVD]"},{"snapshot_id":"226822","ranking":"203110","title":"Harry Potter and the Deathly Hallows, Part 1 (With Dobby Bookend)"},{"snapshot_id":"238074","ranking":"210884","title":"Harry Potter and the Deathly Hallows - Part 1 (UMD for PSP)"},{"snapshot_id":"202672","ranking":"210915","title":"Harry Potter-Half Blood"},{"snapshot_id":"239377","ranking":"226591","title":"Harry Potter And The Deathly Hallows Part 2 - UMD Region Free (0)"},{"snapshot_id":"74348","ranking":"233253","title":"Harry Potter and the Sorcerers Stone"},{"snapshot_id":"204255","ranking":"241862","title":"Harry Potter and the Half-Blood Prince [UMD for PSP]"},{"snapshot_id":"122438","ranking":"246596","title":"Harry Potter and the Chamber of Secrets (Mini DVD) (Harry Potter 2)"},{"snapshot_id":"79177","ranking":"317540","title":"Harry Potter and the Sorcerers Stone"},{"snapshot_id":"227526","ranking":"337361","title":"Harry Potter and the Sorcerers Stone (Blu-ray + DVD + Digital Copy Combo Pack)"},{"snapshot_id":"238521","ranking":"349764","title":"Harry Potter & The Deathly Hallows: Part 1 [Blu-ray]"},{"snapshot_id":"75550","ranking":"353600","title":"Harry Potter and the Sorcerers Stone - Spanish Edition [VHS]"},{"snapshot_id":"251415","ranking":"393055","title":"Harry Potter And Chamber of Secrets [UMD Mini for PSP]"},{"snapshot_id":"76606","ranking":"408876","title":"Harry Potter and the Sorcerers Stone"},{"snapshot_id":"222810","ranking":"409970","title":"Harry Potter and the Order of the Phoenix [Blu-ray]"},{"snapshot_id":"120442","ranking":"426364","title":"Harry Potter and the Prisoner of Azkaban (Mini DVD) (Harry Potter 3)"},{"snapshot_id":"226835","ranking":"435481","title":"Harry Potter and the Order of the Phoenix"},{"snapshot_id":"112977","ranking":"461995","title":"Harry Potter and the Chamber of Secrets"},{"snapshot_id":"114972","ranking":"464276","title":"Harry Potter and the Sorcerers Stone"},{"snapshot_id":"83213","ranking":"500118","title":"Harry Potter and the Sorcerers Stone Gift Set With Fluffy Collectible [VHS]"},{"snapshot_id":"87831","ranking":"505173","title":"Harry Potter and the Chamber of Secrets (Spanish) [VHS]"},{"snapshot_id":"113629","ranking":"580130","title":"Harry Potter and the Prisoner of Azkaban [VHS]"},{"snapshot_id":"123321","ranking":"583410","title":"Harry Potter and the Goblet of Fire"},{"snapshot_id":"81075","ranking":"675272","title":"Interviews with Students"},{"snapshot_id":"85585","ranking":"739138","title":"Harry Potter and the Chamber of Secrets"},{"snapshot_id":"77107","ranking":"782190","title":"Harry Potter and the Sorcerers Stone [VHS]"},{"snapshot_id":"86085","ranking":"794665","title":"Harry Potter and the Chamber of Secrets [VHS]"},{"snapshot_id":"80575","ranking":"817566","title":"Harry Potter and the Chamber of Secrets [VHS]"},{"snapshot_id":"78417","ranking":"882762","title":"Harry Potter and the Sorcerers Stone [VHS]"},{"snapshot_id":"73848","ranking":"902326","title":"Harry Potter and the Sorcerers Stone [VHS]"}],"databaseType":"MYSQL","queryTime":"34ms"}
```

