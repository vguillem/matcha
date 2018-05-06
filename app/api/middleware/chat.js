var mysql = require('mysql');
var bdd = require('../config/database')

module.exports =(req, res, next) => {
	if (req.session.ichat) {
		res.locals.ichat = req.session.ichat
	}
	next()
}
