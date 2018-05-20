var Verif = require('../modele/verif.js')

exports.chat = (req, res) => {
	var chat = require('../modele/chat.js')
	var auth = require('../modele/auth.js')
	var login = req.query.id
	if (!Verif.verif(login, 0, 20)) {
		res.render('404')
	}
	else {
		auth.login(login, (rows3) => {
			if (rows3[0]) {
				chat.getchat(req.session.user.login, login, req.session.user.id, rows3[0].id, (rows2) => {
					var i = 0
					while (rows2[i]) {
						if (rows2[i].login_posteur === req.session.user.login)
							rows2[i].login_posteur = 'Vous'
						i++
					}
					res.locals.login = login
					res.locals.chat = rows2.reverse()
					res.render('chat/chat')
				})
			}
			else {
				res.render('404')
			}
		})
	}
}


exports.chats = (req, res) => {
	var chat = require('../modele/chat.js')
	chat.allchat(req.session.user.id, (rows) => {
		if (rows){
			res.locals.chats = rows
		}
		res.render('chat/chats')
	})
}


exports.ichat = (req, res) => {
	if (Verif.verif(req.query.login, 0, 20)) {
		req.session.ichat= req.query.login
	}
	res.redirect('/chats')
}


