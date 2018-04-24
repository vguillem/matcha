var mysql = require('mysql');
var bdd = require('../config/database')

module.exports =(req, res, next) => {
	if (req.session.user) {
		var sql = "UPDATE users SET lastco=NOW() WHERE id=?"
		var inserts = [req.session.user.id]
		bdd.query(mysql.format(sql, inserts))
	}
	next()
}
