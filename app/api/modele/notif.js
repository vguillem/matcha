var mysql = require('mysql');
var bdd = require('../config/database')

class Notif {

	static vunotif (id) {
		var sql = "UPDATE notif SET vu=1 WHERE id_notifie=?"
		var inserts = [id]
		bdd.query(mysql.format(sql, inserts))
	}


	static chatnotif (id_notifieur, id_notifie) {
		var sql = "INSERT INTO notif SET id_notifieur= ?, id_notifie= ?, action='vous a envoye un message', heure=NOW()"
		var inserts = [id_notifieur, id_notifie]
		bdd.query(mysql.format(sql, inserts))
	}


	static mlike (id_notifieur, id_notifie) {
		var sql = "INSERT INTO notif SET id_notifieur= ?, id_notifie= ?, action='vous a matche (vous l avez deja matche)', heure=NOW()"
		var inserts = [id_notifieur, id_notifie]
		bdd.query(mysql.format(sql, inserts))
	}


	static like (id_notifieur, id_notifie) {
		var sql = "INSERT INTO notif SET id_notifieur= ?, id_notifie= ?, action='vous a matche', heure=NOW()"
		var inserts = [id_notifieur, id_notifie]
		bdd.query(mysql.format(sql, inserts))
	}


	static munlike (id_notifieur, id_notifie) {
		var sql = "INSERT INTO notif SET id_notifieur= ?, id_notifie= ?, action='a arrete de vous matche (vous l avez matche)', heure=NOW()"
		var inserts = [id_notifieur, id_notifie]
		bdd.query(mysql.format(sql, inserts))
	}


	static unlike (id_notifieur, id_notifie) {
		var sql = "INSERT INTO notif SET id_notifieur= ?, id_notifie= ?, action='a arrete de vous matche', heure=NOW()"
		var inserts = [id_notifieur, id_notifie]
		bdd.query(mysql.format(sql, inserts))
	}


	static v_user (id_notifieur, id_notifie) {
		var sql = "INSERT INTO notif SET id_notifieur= ?, id_notifie= ?, action='a vu votre profil', heure=NOW()"
		var inserts = [id_notifieur, id_notifie]
		bdd.query(mysql.format(sql, inserts))
	}


	static newnotif (id, cb) {
		var sql = "SELECT COUNT(notif.id) AS nbnotif FROM notif LEFT JOIN users ON users.id = notif.id_notifieur LEFT JOIN blist ON blist.id_bloqueur= ? AND blist.id_bloque=notif.id_notifieur WHERE id_notifie=? AND blist.id IS NULL AND notif.vu='0' ORDER BY notif.id DESC"
		var inserts = [id, id]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}


	static getnotif (id, cb) {
		var sql = "SELECT notif.action AS action, notif.id_notifieur AS notifieur, DATE_FORMAT(notif.heure, '%d/%m/%Y a %h:%i') AS heure, users.login AS login FROM notif LEFT JOIN users ON users.id = notif.id_notifieur LEFT JOIN blist ON blist.id_bloqueur= ? AND blist.id_bloque=notif.id_notifieur WHERE id_notifie=? AND blist.id IS NULL ORDER BY notif.id DESC"
		var inserts = [id, id]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}

}

module.exports = Notif
