var mysql = require('mysql');
var bdd = require('../config/database')

class Auth {

	static create (login, firstname, lastname, mail, passwd) {
		var sql = "INSERT INTO users SET login= ?, firstname= ?, lastname= ?, mail= ?, passwd= ?, date=NOW()"
		var inserts = [login, firstname, lastname, mail, passwd]
		bdd.query(mysql.format(sql, inserts))
	}


	static compte (login, firstname, lastname, mail, passwd) {
		var sql = "UPDATE users SET firstname= ?, lastname= ?, mail= ?, passwd= ? WHERE id = ?"
		var inserts = [firstname, lastname, mail, passwd, login]
		bdd.query(mysql.format(sql, inserts))
	}


	static delcode (code) {
		var sql = "DELETE FROm rmdp WHERE code = ?"
		var inserts = [code]
		bdd.query(mysql.format(sql, inserts))
	}


	static uppasswd (passwd, id) {
		var sql = "UPDATE users SET passwd= ? WHERE id = ?"
		var inserts = [passwd, id]
		bdd.query(mysql.format(sql, inserts))
	}

	static getcode (code, cb) {
		var sql = "SELECT * FROM rmdp WHERE code= ? LIMIT 1"
		var inserts = [code]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}


	static login (login, cb) {
		var sql = "SELECT * FROM users WHERE login= ? LIMIT 1"
		var inserts = [login]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}

	static getmail (mail, cb) {
		var sql = "SELECT id FROM users WHERE mail= ? LIMIT 1"
		var inserts = [mail]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}


	static insert_forgot (id, code) {
		var sql = "INSERT INTO rmdp SET id_user= ?, code= ?"
		var inserts = [id, code]
		bdd.query(mysql.format(sql, inserts))
	}


	static rm_forgot (id) {
		var sql = "DELETE FROM rmdp WHERE id_user= ?"
		var inserts = [id]
		bdd.query(mysql.format(sql, inserts))
	}

	static iploc (id, ville, lat, lng) {
		var sql = "SELECT id FROM profil WHERE id_user= ?"
		var inserts = [id]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			if (rows[0])
			{
				var sql2 = "UPDATE profil SET ville=?, lat=?, lng=? WHERE id_user=? AND geolocalise='0'"
				var inserts2 = [ville, lat, lng, id]
				bdd.query(mysql.format(sql2, inserts2))
			}
			else 
			{
				var sql3 = "INSERT INTO profil SET id_user=?, ville=?, lat=?, lng=?"
				var inserts3 = [id, ville, lat, lng]
				bdd.query(mysql.format(sql3, inserts3))
			}
		})
	}
}

module.exports = Auth
