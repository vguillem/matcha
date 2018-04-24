var mysql = require('mysql');
var bdd = require('../config/database')
var data = [
	{"tag": "42"},
	{"tag": "voiture"},
	{"tag": "lire"},
	{"tag": "jongler"},
	{"tag": "jeux"},
	{"tag": "informatique"},
	{"tag": "securite"},
	{"tag": "math"},
	{"tag": "dormir"},
	{"tag": "manger"},
	{"tag": "jardiner"},
	{"tag": "sex"},
	{"tag": "musique"},
	{"tag": "techno"},
	{"tag": "classique"},
	{"tag": "photos"},
	{"tag": "art"},
	{"tag": "voyage"},
	{"tag": "recherche"},
	{"tag": "programation"},
	{"tag": "cinema"},
	{"tag": "fleur"},
	{"tag": "pain"},
	{"tag": "herbe"}
	];
	
data.forEach((tmp) => {
	var sql = "INSERT INTO tag SET tag= ?"
	var inserts = [tmp.tag]
	bdd.query(mysql.format(sql, inserts))
})

var i = 1
while (i < 751)
{
	var k = 0
	var t = Math.floor(Math.random() * (7 - 1) + 1);
	while (k < t)
	{
		var j = Math.floor(Math.random() * (24 - 1) + 1);
		var sql = "INSERT INTO join_tag SET id_tag= ?, id_user= ?"
		var inserts = [j, i]
		bdd.query(mysql.format(sql, inserts))
		k++;
	}
	i++;
}
	var sql= "delete t1 from join_tag as t1, join_tag as t2 where t1.id > t2.id and t1.id_user = t2.id_user AND t1.id_tag = t2.id_tag"
	bdd.query(sql)
