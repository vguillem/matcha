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
						var sql ="SELECT * FROM chat WHERE (login_posteur=? AND login_destinataire=?) OR (login_posteur=? AND login_destinataire=?) ORDER BY id DESC LIMIT 50"
						var inserts = [loginsrc, logindest, logindest, loginsrc]
						bdd.query(mysql.format(sql, inserts), (err, rows4) => {
							if (err) throw err
							if (rows4[0])
								cb (rows4)
							else
								cb([{'login_posteur': 'Chat', 'message' : 'Demarer la conversation'}])
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

	static allchat (id, cb) {
		var sql = "SELECT c1.id_liker, users.login FROM tlike AS c1 JOIN tlike AS c2 ON c1.id_likeur=c2.id_liker AND c1.id_liker=c2.id_likeur LEFT JOIN users ON users.id=c1.id_liker WHERE c1.id_likeur=? OR c2.id_liker=?"
		var inserts = [id, id]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb (rows)
		})
	}
}

module.exports = Chat
