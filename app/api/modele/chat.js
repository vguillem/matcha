var mysql = require('mysql');
var bdd = require('../config/database')

class Chat {
//protege longueur variable
	static getchat (loginsrc, logindest, idsrc, iddest, cb) {
		var sql = "SELECT id FROM tlike WHERE id_likeur=? AND id_liker=?"
		var inserts = [idsrc, iddest]
		bdd.query(mysql.format(sql, inserts), (err, rows2) => {
			if (err) throw err
			if (rows2[0]) {
				var sql = "SELECT id FROM tlike WHERE id_likeur=? AND id_liker=?"
				var inserts = [iddest, idsrc]
				bdd.query(mysql.format(sql, inserts), (err, rows3) => {
					if (err) throw err
					if (rows3[0]) {
						var sql ="SELECT * FROM chat WHERE (login_posteur=? AND login_destinataire=?) OR (login_posteur=? AND login_destinataire=?) LIMIT 50"
						var inserts = [loginsrc, logindest, logindest, loginsrc]
						bdd.query(mysql.format(sql, inserts), (err, rows4) => {
							if (err) throw err
							cb (rows4)
						})
					}
					else
						cb(rows3)
				})
			}
			else
				cb(rows2)
		})
	}
}

module.exports = Chat
