var Verif = require('../modele/verif.js')

exports.addblist = (req, res) => {
	if (!Verif.verif(req.params.id, 1, 0))
	{
		res.redirect('/sall')
	}
	else {
	var pro = require('../modele/profil.js')
	pro.dellblist(req.session.user.id, req.params.id)
	pro.addblist(req.session.user.id, req.params.id)
	pro.unlike(req.session.user.id, req.params.id)
	req.flash('succes', 'Utilisateur bloque')
	res.redirect('/sall')
	}
}

exports.dellblist = (req, res) => {
	if (!Verif.verif(req.params.id, 1, 0))
	{
		res.redirect('/sall')
	}
	else {
	var pro = require('../modele/profil.js')
	pro.dellblist(req.session.user.id, req.params.id)
	res.redirect(req.session.lastpage)
	}
}


exports.report = (req, res) => {
	req.flash('succes', 'une alerte a ete envoye')
	res.redirect(req.session.lastpage)
}


exports.getblist = (req, res) => {
	var pro = require('../modele/profil.js')
	pro.getblist(req.session.user.id, (rows) => {
		if (rows[0])
			res.locals.blist = rows
		res.render('profil/blist')
	})
}


