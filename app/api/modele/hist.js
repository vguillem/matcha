var mysql = require('mysql');
var bdd = require('../config/database')

class Hist {

	static like (id_visiteur, id_visite) {
		var sql = "INSERT INTO history SET id_visiteur= ?, id_visite= ?, action='a arrete de vous matche', heure=NOW()"
		var inserts = [id_visiteur, id_visite]
		bdd.query(mysql.format(sql, inserts))
	}


	static unlike (id_visiteur, id_visite) {
		var sql = "INSERT INTO history SET id_visiteur= ?, id_visite= ?, action='vous a matche', heure=NOW()"
		var inserts = [id_visiteur, id_visite]
		bdd.query(mysql.format(sql, inserts))
	}


	static v_user (id_visiteur, id_visite) {
		var sql = "INSERT INTO history SET id_visiteur= ?, id_visite= ?, action='a vu votre profil', heure=NOW()"
		var inserts = [id_visiteur, id_visite]
		bdd.query(mysql.format(sql, inserts))
	}


	static get_hist (id, cb) {
		var sql = "SELECT history.action AS action, history.id_visiteur AS visiteur, DATE_FORMAT(history.heure, '%d/%m/%Y a %h:%i') AS heure, users.login AS login FROM history LEFT JOIN users ON users.id = history.id_visiteur WHERE id_visite=? ORDER BY history.id DESC"
		var inserts = [id]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}

}

module.exports = Hist
