var mysql = require('mysql');
var bdd = require('../config/database')
var sel = "SELECT users.id AS uid, GROUP_CONCAT(tag.id) AS idtag, GROUP_CONCAT(tag.tag) AS tag, users.login AS login, profil.genre AS genre, profil.age AS age, profil.bio AS bio, DATE_FORMAT(users.lastco, '%d/%m/%Y %Hh%i') AS lastco, (NOW() - users.lastco) AS tlastco, users.firstname AS firstname, users.lastname AS lastname, DATE_FORMAT(users.date, '%d/%m/%Y') AS inscription, profil.orientation AS orientation, profil.img_profil AS img_profil,profil.p_profil AS p_profil, tlike.id AS tlikeid, profil.ville AS ville, ROUND(ST_Distance_Sphere(point(?, ?), point(profil.lng, profil.lat)) / 1000) AS distance"

class Search {

	static  postall (id, genre, orientation, lato, lngo, agemin, agemax, distmin, distmax, popmin, popmax, tri, cb) {
		if (!tri)
			tri = 'uid'
		else if (tri !== 'distance' && tri !== 'pop' && tri !== 'age')
			tri = 'uid'
		if (orientation === 3)
		{
		var sql = sel + "\
			FROM profil\
			LEFT JOIN users\
			ON users.id = profil.id_user\
			LEFT JOIN join_tag\
			ON join_tag.id_user = profil.id_user\
			LEFT JOIN tag\
			ON join_tag.id_tag = tag.id\
			LEFT JOIN blist\
			ON blist.id_bloqueur = ? AND blist.id_bloque = users.id\
			LEFT JOIN tlike\
			ON tlike.id_liker = profil.id_user AND tlike.id_likeur = ?\
			WHERE profil.id_user!= ? AND (profil.orientation= ? OR profil.orientation=3) AND (profil.age BETWEEN ? AND ?) AND (profil.pop BETWEEN ? AND ?) AND (ST_Distance_Sphere(point(?, ?), point(profil.lng, profil.lat)) / 1000 BETWEEN ? AND ?) AND blist.id IS NULL\
			GROUP BY uid\
			ORDER BY " + tri
			var inserts = [lngo, lato, id, id, id, genre, agemin, agemax, popmin, popmax, lngo, lato, distmin, distmax]
		}
		else
		{
		var sql = sel + "\
			FROM profil\
			LEFT JOIN users\
			ON users.id = profil.id_user\
			LEFT JOIN join_tag\
			ON join_tag.id_user = profil.id_user\
			LEFT JOIN tag\
			ON join_tag.id_tag = tag.id\
			LEFT JOIN blist\
			ON blist.id_bloqueur = ? AND blist.id_bloque = users.id\
			LEFT JOIN tlike\
			ON tlike.id_liker = profil.id_user AND tlike.id_likeur = ?\
			WHERE profil.id_user!= ? AND profil.genre= ? AND (profil.orientation= ? OR profil.orientation=3) AND (profil.age BETWEEN ? AND ?) AND (profil.pop BETWEEN ? AND ?) AND (ST_Distance_Sphere(point(?, ?), point(profil.lng, profil.lat)) / 1000 BETWEEN ? AND ?) AND blist.id IS NULL\
			GROUP BY uid\
			ORDER BY " + tri
			var inserts = [lngo, lato, id, id, id, orientation, genre, agemin, agemax, popmin, popmax, lngo, lato, distmin, distmax]
		}
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}


	static  user (lng, lat, id, reqid, cb) {
		var sql = sel + "\
		FROM users\
		LEFT JOIN profil\
		ON users.id = profil.id_user\
		LEFT JOIN join_tag\
		ON join_tag.id_user = profil.id_user\
		LEFT JOIN tag\
		ON join_tag.id_tag = tag.id\
		LEFT JOIN tlike\
		ON tlike.id_liker = profil.id_user AND tlike.id_likeur = ?\
		WHERE users.id= ?\
		GROUP BY users.id"
		var inserts = [lng, lat, reqid, id]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}

}


module.exports = Search
