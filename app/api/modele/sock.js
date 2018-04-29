var mysql = require('mysql');
var bdd = require('../config/database')

class Sock {

	static newmessage (logindest, idsrc, loginsrc, message, cb) {
		var sql = "SELECT id FROM users WHERE login=?"
		var inserts = [logindest]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			if (rows[0]) {
				var sql = "SELECT id FROM tlike WHERE id_likeur=? AND id_liker=?"
				var inserts = [idsrc, rows[0].id]
				bdd.query(mysql.format(sql, inserts), (err, rows2) => {
					if (err) throw err
					if (rows2[0]) {
						var sql = "SELECT id FROM tlike WHERE id_likeur=? AND id_liker=?"
						var inserts = [rows[0].id, idsrc]
						bdd.query(mysql.format(sql, inserts), (err, rows3) => {
							if (err) throw err
							if (rows3[0]) {
								var sql = "INSERT INTO chat SET message=?, login_posteur=?, login_destinataire=?, heure=NOW()"
								var inserts = [message, loginsrc, logindest]
								bdd.query(mysql.format(sql, inserts))
								cb (rows3)
							}
							else
								cb(rows3)
						})
					}
					else
						cb(rows2)
				})
			}
			else
				cb(rows)
		})
	}
}



module.exports = Sock
