var mysql = require('mysql');
var bdd = require('../config/database')
var sel = "SELECT users.id AS uid, GROUP_CONCAT(tag.tag) AS tag, users.login AS login, profil.genre AS genre, profil.age AS age, profil.bio AS bio, DATE_FORMAT(users.lastco, '%d %m %Y %H:%i') AS lastco, (NOW() - users.lastco) AS tlastco, users.firstname AS firstname, users.lastname AS lastname, DATE_FORMAT(users.date, '%d %M %Y') AS inscription, profil.orientation AS orientation, profil.img_profil AS img_profil, tlike.id AS tlikeid, profil.ville AS ville"

class Search {

	static  postall (id, genre, orientation, lato, lngo, agemin, agemax, distmin, distmax, popmin, popmax, cb) {
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
			LEFT JOIN tlike\
			ON tlike.id_liker = profil.id_user AND tlike.id_likeur = ?\
			WHERE profil.id_user!= ? AND (profil.orientation= ? OR profil.orientation=3) AND (profil.age BETWEEN ? AND ?) AND (profil.pop BETWEEN ? AND ?) AND (ST_Distance_Sphere(point(?, ?), point(profil.lng, profil.lat)) BETWEEN ? AND ?)\
			GROUP BY uid"
			var inserts = [id, id, genre, agemin, agemax, popmin, popmax, lngo, lato, distmin, distmax]
			//var sql = "SELECT u.*, pr.*FROM users as u LEFT JOIN profil AS pr ON pr.id_user= u.id WHERE pr.id_user!= ? AND pr.genre< ? AND (pr.orientation= ? OR pr.orientation= 3)"
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
			LEFT JOIN tlike\
			ON tlike.id_liker = profil.id_user AND tlike.id_likeur = ?\
			WHERE profil.id_user!= ? AND profil.genre= ? AND (profil.orientation= ? OR profil.orientation=3) AND (profil.age BETWEEN ? AND ?) AND (profil.pop BETWEEN ? AND ?) AND (ST_Distance_Sphere(point(?, ?), point(profil.lng, profil.lat)) BETWEEN ? AND ?)\
			GROUP BY uid"
			var inserts = [id, id, orientation, genre, agemin, agemax, popmin, popmax, lngo, lato, distmin, distmax]
		}
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}


	static  all (id, genre, orientation, cb) {
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
			LEFT JOIN tlike\
			ON tlike.id_liker = profil.id_user AND tlike.id_likeur = ?\
			WHERE profil.id_user!= ? AND (profil.orientation= ? OR profil.orientation=3)\
			GROUP BY uid"
			var inserts = [id, id, genre]
			//var sql = "SELECT u.*, pr.*FROM users as u LEFT JOIN profil AS pr ON pr.id_user= u.id WHERE pr.id_user!= ? AND pr.genre< ? AND (pr.orientation= ? OR pr.orientation= 3)"
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
			LEFT JOIN tlike\
			ON tlike.id_liker = profil.id_user AND tlike.id_likeur = ?\
			WHERE profil.id_user!= ? AND profil.genre= ? AND (profil.orientation= ? OR profil.orientation=3)\
			GROUP BY uid"
			var inserts = [id, id, orientation, genre]
		}
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}


	static  user (id, cb) {
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
		var inserts = [id, id]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}

}

module.exports = Search
