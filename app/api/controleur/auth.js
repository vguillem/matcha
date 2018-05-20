var bcrypt = require('bcrypt')
var iploc = require('iplocation')
var nodemailer = require('nodemailer');
var Verif = require('../modele/verif.js')
var vmatcha = 'v.matcha42@gmail.com'
var vmatchap = 'PasWoRd'

exports.resetmdppost = (req, res) => {
	if (req.session.user)
	{
		res.redirect('/sall')
	}
	else {
	var ente = req.query.code
	var num = /[0-9]/
	var min = /[a-z]/
	var maj = /[A-Z]/
	if (!Verif.verif(ente, 0, 20)) {
		req.flash('error', 'Code invalide.')
		res.redirect('/forgot')
	}
	else if (!Verif.verif(req.body.passwd, 0, 30)) {
		req.flash('error', 'erreur password.')
		res.redirect('/forgot')
	}
	else if (!num.test(req.body.passwd) || !min.test(req.body.passwd) || !maj.test(req.body.passwd) || req.body.passwd < 8)
	{
		req.flash('error', 'mot de passe trop simple.')
		res.redirect('/resetmdp?code=' + ente)
	}
	else {
		var auth = require('../modele/auth.js')
		auth.getcode(ente, (rows) => {
			if (rows[0]) {
				bcrypt.hash(req.body.passwd, 10, (err, hash) => {
					auth.uppasswd(hash, rows[0].id_user)
					req.flash('succes', 'Mot de passe modifie.')
					res.redirect('/login')
				})
			auth.delcode(ente)
			}
			else {
				req.flash('error', 'Code invalide.')
				res.redirect('/forgot')
			}
		})
	}
	}
}

exports.resendmail = (req, res) => {
	if (req.session.user)
	{
		res.redirect('/sall')
	}
	else {
		if (!Verif.verif(req.body.mail, 0, 250)) {
			req.flash('error', 'Mail invalide.')
			res.redirect('/login')
		}
		else {
			var auth = require('../modele/auth.js')
			var i = 0
			var code = ''
			var tab = "abcdefghijklmnopkrstuvwxyz1234567890"
			while (i < 10)
			{
				var t = Math.floor(Math.random() * (36 - 1) + 1);
				code = code + tab[t]
				i++
			}
			auth.resendmail(req.body.mail, code, (rows) => {
				if (rows[0]) {
					code = rows[0].login + code
					var transporter = nodemailer.createTransport({
					  service: 'Gmail',
						auth: {
							user: vmatcha,
							pass: vmatchap
						}
					});
					var message = 'pour activer votre compte, cliquez sur le lien suivant: http://5.196.225.53:8100/validation?code=' + code
					var mailOptions = {
						from: vmatcha,
						to: req.body.mail,
						subject: 'Creation compte matcha',
						text: message
					};
					transporter.sendMail(mailOptions, (error, info) => {
						if (error) {
							throw error
						}
					}); 
					req.flash('succes', 'Le mail d activation a ete envoye')
					res.redirect('/login')
				}
				else {
					req.flash('error', 'Mail invalide.')
					res.redirect('/login')
				}
			})
		}
	}
}


exports.validation = (req, res) => {
	if (req.session.user)
	{
		res.redirect('/sall')
	}
	else {
		if (!Verif.verif(req.query.code, 0, 40)) {
			req.flash('error', 'Code invalide.')
			res.redirect('/login')
		}
		else {
			var auth = require('../modele/auth.js')
			auth.validation(req.query.code, (rows) => {
				req.flash('succes', 'Compte active')
				res.redirect('/login')
			})
		}
	}
}


exports.resetmdp = (req, res) => {
	if (req.session.user)
	{
		res.redirect('/sall')
	}
	else {
	var ente = req.query.code
	if (!Verif.verif(ente, 0, 20)) {
		req.flash('error', 'Code invalide.')
		res.redirect('/forgot')
	}
	else {
		res.locals.code = ente
		res.render('auth/resetmdp')
	}
	}
}

exports.forgot = (req, res) => {
	if (req.session.user)
	{
		res.redirect('/sall')
	}
	else {
	if (!Verif.verif(req.body.fmail, 0, 250)) {
		req.flash('error', 'Mail invalide.')
		res.redirect('/forgot')
	}
	else {
		var auth = require('../modele/auth.js')

		auth.getmail(req.body.fmail, (rows) => {
			if (rows[0])  {
				req.flash('succes', 'Mail envoye')
				auth.rm_forgot(rows[0].id)
				var code = rows[0].id.toString()
				var i = 0
				var tab = "abcdefghijklmnopkrstuvwxyz1234567890"
				while (i < 10)
				{
					var t = Math.floor(Math.random() * (36 - 1) + 1);
					code = code + tab[t]
					i++
				}
				auth.insert_forgot(rows[0].id, code)
				var transporter = nodemailer.createTransport({
				  service: 'Gmail',
					auth: {
						user: vmatcha,
						pass: vmatchap
					}
				});
				var message = 'pour reinitialiser votre mot de passe, cliquez sur le lien suivant: http://5.196.225.53:8100/resetmdp?code=' + code
				var mailOptions = {
					from: vmatcha,
					to: req.body.fmail,
					subject: 'Reset mdp matcha',
					text: message
				};
				transporter.sendMail(mailOptions, (error, info) => {
					if (error) {
						throw error
					}
				}); 
				res.redirect('/login')
			}
			else {
				req.flash('error', 'Mail invalide.')
				res.redirect('/forgot')
			}
		})
	}
	}
}

exports.login = (req, res) => {
	if (!Verif.verif(req.body.llogin, 0, 250) || !Verif.verif(req.body.lpasswd, 0, 30)) {
		req.flash('error', 'Erreur login.')
		res.redirect('/login')
	}
	else
	{
		var auth = require('../modele/auth.js')
		auth.login(req.body.llogin, (rows) => {
			if (rows[0])
			{
				if (rows[0].vtoken !== '1') {
					req.flash('error', 'Compte non active')
					res.redirect('/resendmail')
				}
				else {
					bcrypt.compare(req.body.lpasswd, rows[0].passwd, (err, hash) => {
						if (hash) {
							req.session.user = rows[0]
							req.flash('succes', 'Autentification reussie.')
							var ip = req.headers['x-forward-for'] || req.connection.remoteAddress
							iploc(ip, (err, loc) => {
								auth.iploc(req.session.user.id, loc.city, loc.latitude, loc.longitude)
							})
							res.redirect('/sall')
						}
						else
						{
							req.flash('error', 'Erreur login.')
							res.redirect('/login')
						}
					})
				}
			}
			else
			{
				req.flash('error', 'Erreur login.')
				res.redirect('/login')
			}
		})
	}
}

exports.create = (req, res) => {
	var auth = require('../modele/auth.js')
	if (!Verif.verif(req.body.clogin, 0, 20))
	{
		req.flash('error', 'Login Erreur.')
		res.redirect('/create')
	}
	else if (!Verif.verif(req.body.clastname, 0, 50))
	{
		req.flash('error', 'Nom Erreur.')
		res.redirect('/create')
	}
	else if (!Verif.verif(req.body.cfirstname, 0, 50))
	{
		req.flash('error', 'Prenom Erreur')
		res.redirect('/create')
	}
	else if (!Verif.verif(req.body.cmail, 0, 250))
	{
		req.flash('error', 'Email Erreur')
		res.redirect('/create')
	}
	else if (!Verif.verif(req.body.cpasswd, 0, 30))
	{
		req.flash('error', 'Password Erreur')
		res.redirect('/create')
	}
	else
	{
		auth.login(req.body.clogin, (rows) => {
			if (rows[0])
			{
				req.flash('error', 'Login deja utilise.')
				res.redirect('/create')
			}
			else
			{
				auth.getmail(req.body.cmail, (rows) => {
					if (rows[0])
					{
						req.flash('error', 'l\'email existe déjà.')
						res.redirect('/create')
					}
					else
					{
						var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
						var num = /[0-9]/
						var min = /[a-z]/
						var maj = /[A-Z]/
						if (!re.test(req.body.cmail))
						{
							req.flash('error', 'Email non valide.')
							res.redirect('/create')
						}
						else if (num.test(req.body.cpasswd) && min.test(req.body.cpasswd) && maj.test(req.body.cpasswd) && req.body.cpasswd.length > 7)
						{
							bcrypt.hash(req.body.cpasswd, 10, (err, hash) => {
								var code = req.body.clogin
								var i = 0
								var tab = "abcdefghijklmnopkrstuvwxyz1234567890"
								while (i < 10)
								{
									var t = Math.floor(Math.random() * (36 - 1) + 1);
									code = code + tab[t]
									i++
								}
								auth.create(req.body.clogin, req.body.cfirstname, req.body.clastname, req.body.cmail, hash, code)
									var transporter = nodemailer.createTransport({
									  service: 'Gmail',
										auth: {
											user: vmatcha,
											pass: vmatchap
										}
									});
									var message = 'pour activer votre compte, cliquez sur le lien suivant: http://5.196.225.53:8100/validation?code=' + code
									var mailOptions = {
										from: vmatcha,
										to: req.body.cmail,
										subject: 'Creation compte matcha',
										text: message
									};
									transporter.sendMail(mailOptions, (error, info) => {
										if (error) {
											throw error
										}
									}); 
								req.flash('succes', 'Compte créé, un mail d activation a ete envoye')
							})
							res.redirect('/')
						}
						else
						{
							req.flash('error', 'Votre mot de passe n\'est pas assez complique.')
							res.redirect('/create')
						}
					}
				})
			}
		})
	}
}

exports.compte = (req, res) => {
	var auth = require('../modele/auth.js')
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	var firstname = req.session.user.firstname
	var lastname = req.session.user.lastname
	var pass = req.session.user.passwd
	var mail = req.session.user.mail
	if (Verif.verif(req.body.clastname, 0, 50))
		lastname = req.body.clastname
	if (Verif.verif(req.body.cfirstname, 0, 50))
		firstname = req.body.cfirstname
	if (Verif.verif(req.body.cemail, 0, 250))
		mail = req.body.cemail
	if (!re.test(mail))
	{
		req.flash('error', 'Email non valide.')
		res.redirect('/compte')
	}
	else if (Verif.verif(req.body.cpasswd, 0, 50))
	{
		var num = /[0-9]/
		var min = /[a-z]/
		var maj = /[A-Z]/
		if (num.test(req.body.cpasswd) && min.test(req.body.cpasswd) && maj.test(req.body.cpasswd) && req.body.cpasswd.length > 7)
		{
			bcrypt.hash(req.body.cpasswd, 10, (err, hash) => {
				auth.compte(req.session.user.id, firstname, lastname, mail, hash)
				req.session.user.lastname = lastname
				req.session.user.firstname = firstname
				req.session.user.mail = mail
				req.session.user.passwd = hash
				req.flash('succes', 'Compte modifie.')
				res.redirect('/sall')
			})
		}
		else
		{
			req.flash('error', 'Votre mot de passe n\'est pas assez complique.')
			res.redirect('/compte')
		}
	}
	else
	{
		req.session.user.lastname = lastname
		req.session.user.firstname = firstname
		req.session.user.mail = mail
		auth.compte(req.session.user.id, firstname, lastname, mail, pass)
		req.flash('succes', 'Compte modifie.')
		res.redirect('/sall')
	}
}

exports.compteget = (req, res) => {
	res.locals.firstname = req.session.user.firstname
	res.locals.lastname = req.session.user.lastname
	res.locals.mail = req.session.user.mail
	res.render('auth/compte')
}


exports.home = (req, res) => {
	res.render('index')
}

exports.logout = (req, res) => {
	if (req.session.user)
	{
		req.session.user = undefined
		req.session.ichat = undefined
	}
	res.redirect('/')
}
