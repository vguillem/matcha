var mysql = require('mysql');
var bdd = require('../config/database')

class Search {

	static  all (id, genre, orientation, cb) {
		if (orientation === 3)
		{
			var sql = "SELECT users.id AS uid, GROUP_CONCAT(tag.tag) AS tag, users.login AS login, profil.genre AS genre, profil.age AS age, profil.bio AS bio\
			FROM profil\
			LEFT JOIN users\
			ON users.id = profil.id_user\
			LEFT JOIN join_tag\
			ON join_tag.id_user = profil.id_user\
			LEFT JOIN tag\
			ON join_tag.id_tag = tag.id\
			WHERE profil.id_user!= ? AND (profil.orientation= ? OR profil.orientation=3)\
			GROUP BY uid"
			var inserts = [id, genre]
			//var sql = "SELECT u.*, pr.*FROM users as u LEFT JOIN profil AS pr ON pr.id_user= u.id WHERE pr.id_user!= ? AND pr.genre< ? AND (pr.orientation= ? OR pr.orientation= 3)"
		}
		else
		{
			var sql = "SELECT users.id AS uid, GROUP_CONCAT(tag.tag) AS tag, users.login AS login, profil.genre AS genre, profil.age AS age, profil.bio AS bio\
			FROM profil\
			LEFT JOIN users\
			ON users.id = profil.id_user\
			LEFT JOIN join_tag\
			ON join_tag.id_user = profil.id_user\
			LEFT JOIN tag\
			ON join_tag.id_tag = tag.id\
			WHERE profil.id_user!= ? AND profil.genre= ? AND (profil.orientation= ? OR profil.orientation=3)\
			GROUP BY uid"
			var inserts = [id, orientation, genre]
		}
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}

}

module.exports = Search
