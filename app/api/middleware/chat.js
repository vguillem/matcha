var mysql = require('mysql');
var bdd = require('../config/database')

module.exports =(req, res, next) => {
	if (req.session.ichat) {
		var sql = "SELECT id FROM users WHERE login=?"
		var inserts = [req.session.ichat]
		bdd.query(mysql.format(sql, inserts), (err, rows) => {
			if (err) throw err
			if  (rows[0]) {
				var sql = "SELECT tlike.id FROM tlike WHERE (tlike.id_likeur=? AND tlike.id_liker=?) OR (tlike.id_likeur=? AND tlike.id_liker=?)"
				var inserts = [req.session.user.id, rows[0].id, rows[0].id, req.session.user.id]
				bdd.query(mysql.format(sql, inserts), (err, rows2) => {
					if (err) throw err
					if  (rows2[0] && rows2[1]) {
						res.locals.ichat = req.session.ichat
						var chat = require('../modele/chat.js')
						var auth = require('../modele/auth.js')
						auth.login(req.session.ichat, (rows3) => {
							if (rows3[0]) {
								chat.getchat(req.session.user.login, req.session.ichat, req.session.user.id, rows[0].id, (rows3) => {
									var i = 0
									while (rows3[i]) {
										if (rows3[i].login_posteur === req.session.user.login)
											rows3[i].login_posteur = 'Vous'
										i++
									}
									res.locals.clogin = req.session.ichat
									res.locals.cchat = rows3.reverse()
									next()
								})
							}
							else {
								req.session.ichat = undefined
								next()
							}
						})
					}
					else {
						req.session.ichat = undefined
						next()
					}
				})
			}
			else {
				req.session.ichat = undefined
				next()
			}
		})
	}
	else {
		req.session.ichat = undefined
		next()
	}
}
