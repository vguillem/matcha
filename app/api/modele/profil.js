var mysql = require('mysql');
var bdd = require('../config/database')

class Profil {

	static reput (id, cb) {
		var sql = "SELECT id FROM tlike WHERE id_liker= ?"
		var inserts = [id]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}

	static checklike (likeur, liker, cb) {
		var sql = "SELECT id FROM tlike WHERE id_likeur= ? AND id_liker= ? LIMIT 1"
		var inserts = [likeur, liker]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}

	static like (likeur, liker) {
		var sql = "INSERT INTO tlike SET id_likeur= ?, id_liker= ?"
		var inserts = [likeur, liker]
		bdd.query(mysql.format(sql, inserts))
	}


	static unlike (likeur, liker) {
		var sql = "DELETE FROM tlike where id_likeur= ? AND id_liker= ?"
		var inserts = [likeur, liker]
		bdd.query(mysql.format(sql, inserts))
	}


	static create (login, age, genre, bio, orientation) {
		var sql = "INSERT INTO profil SET id_user= ?, age= ?, genre= ?, orientation= ?, bio= ?"
		var inserts = [login, age, genre, orientation, bio]
		bdd.query(mysql.format(sql, inserts))
	}

	static upprofil (login, age, genre, bio, orientation) {
		var sql = "UPDATE profil SET age= ?, genre= ?, orientation= ?, bio= ? WHERE id_user = ?"
		var inserts = [age, genre, orientation, bio, login]
		bdd.query(mysql.format(sql, inserts))
	}


	static getprofil (id, cb) {
		var sql = "SELECT * FROM profil WHERE id_user= ? LIMIT 1"
		var inserts = [id]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}

	static addtag (id, tag) {
		var sql = "SELECT id from tag WHERE tag= ? LIMIT 1"
		var inserts = [tag]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			if (!rows[0])
			{
				var sql2 = "INSERT INTO tag SET tag= ?"
				var inserts2 = [tag]
				bdd.query(mysql.format(sql2, inserts2), (err2, rows2) => {
					if (err2) throw err2
					var sql4 = "INSERT INTO join_tag SET id_tag= ?, id_user= ?"
					var inserts4 = [rows2.insertId, id]
					bdd.query(mysql.format(sql4, inserts4), (err4, rows4) => {
						if (err4) throw err4
					})
				})
			}
			else
			{
				var sqlc = "SELECT id from join_tag WHERE id_tag= ? AND id_user= ? LIMIT 1"
				var insertsc = [rows[0].id, id]
				bdd.query(mysql.format(sqlc, insertsc), (errc, rowsc) => {
					if (errc) throw errc
					if (!rowsc[0])
					{
						var sqlb = "INSERT INTO join_tag SET id_tag= ?, id_user= ?"
						var insertsb = [rows[0].id, id]
						bdd.query(mysql.format(sqlb, insertsb), (errb, rowsb) => {
							if (errb) throw errb
						})
					}
				})
			}
		})
	}

	static selecttag (id, cb) {
		var sql = "SELECT tag.tag AS tag FROM join_tag JOIN tag ON join_tag.id_user = ? AND tag.id=id_tag"
		var inserts = [id]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			cb(rows)
		})
	}

	static deltag (id, tag) {
		var sql = "DELETE jt.* FROM join_tag AS jt LEFT JOIN tag AS t ON t.id= jt.id_tag WHERE id_user= ? AND t.tag= ?"
		var inserts = [id, tag]
		bdd.query(mysql.format(sql, inserts), (err) => {
			if (err) throw err
		})
	}
}

module.exports = Profil
