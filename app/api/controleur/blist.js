
exports.addblist = (req, res) => {
	var pro = require('../modele/profil.js')
	pro.dellblist(req.session.user.id, req.params.id)
	pro.addblist(req.session.user.id, req.params.id)
	pro.unlike(req.session.user.id, req.params.id)
	res.redirect('/sall')
}

exports.dellblist = (req, res) => {
	var pro = require('../modele/profil.js')
	pro.dellblist(req.session.user.id, req.params.id)
	res.redirect('/sall')
}


exports.report = (req, res) => {
	req.flash('succes', 'une alerte a ete envoye')
	res.redirect('/sall')
}


exports.getblist = (req, res) => {
	var pro = require('../modele/profil.js')
	pro.getblist(req.session.user.id, (rows) => {
		if (rows[0])
			res.locals.blist = rows
		res.render('profil/blist')
	})
}


