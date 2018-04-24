var bcrypt = require('bcrypt')
var iploc = require('iplocation')
var nodemailer = require('nodemailer');

exports.resetmdppost = (req, res) => {
	var ente = req.originalUrl.split('?')
	ente = ente[1].split('=')
	var num = /[0-9]/
	var min = /[a-z]/
	var maj = /[A-Z]/
	if (ente[1] === undefined || ente[1] === '' || ente[1].length > 10) {
		req.flash('error', 'Code invalide.')
		res.redirect('/forgot')
	}
	else if (req.body.passwd === undefined || req.body.passwd === '' || req.body.passwd.length > 30) {
		req.flash('error', 'erreur passord.')
		res.redirect('/forgot')
	}
	else if (!num.test(req.body.passwd) || !min.test(req.body.passwd) || !maj.test(req.body.passwd) || req.body.passwd < 8)
	{
		req.flash('error', 'mot de passe trop simple.')
		res.redirect('/resetmdp?code=' + ente[1])
	}
	else {
		var auth = require('../modele/auth.js')
		auth.getcode(ente[1], (rows) => {
			if (rows[0]) {
				bcrypt.hash(req.body.passwd, 10, (err, hash) => {
					auth.uppasswd(hash, rows[0].id_user)
					req.flash('succes', 'Mot de passe modifie.')
					res.redirect('/login')
				})
			auth.delcode(ente[1])
			}
			else {
				req.flash('error', 'Code invalide.')
				res.redirect('/forgot')
			}
		})
	}
}

exports.resetmdp = (req, res) => {
	var ente = req.originalUrl.split('?')
	if (ente[1] === undefined || ente[1] === '') {
		req.flash('error', 'Code invalide.')
		res.redirect('/forgot')
	}
	else {
		res.locals.code = ente[1]
		res.render('auth/resetmdp')
	}
}

exports.forgot = (req, res) => {
	if (req.body.fmail === undefined || req.body.fmail === '') {
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
				  service: 'gmail',
					auth: {
						user: 'v.matcha42@gmail.com',
						pass: '111111qQ'
					}
				});
				var message = 'pour reinitialiser votre mot de passe, cliquez sur le lien suivant: http://5.196.225.53:8100/resetmdp?code=' + code
				var mailOptions = {
					from: 'v.matcha42@gmail.com',
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
				res.redirect('/login')
			}
		})
	}
}

exports.login = (req, res) => {
	if (req.body.llogin === undefined || req.body.lpasswd === undefined) {
		req.flash('error', 'Erreur login.')
		res.redirect('/login')
	}
	else
	{
		var auth = require('../modele/auth.js')
		auth.login(req.body.llogin, (rows) => {
			if (rows[0])
			{
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
	if (req.body.clogin === undefined || req.body.clogin === '')
	{
		req.flash('error', 'Login Vide.')
		res.redirect('/create')
	}
	else if (req.body.clastname === undefined || req.body.clastname === '')
	{
		req.flash('error', 'Nom vide.')
		res.redirect('/create')
	}
	else if (req.body.cfirstname === undefined || req.body.cfirstname === '')
	{
		req.flash('error', 'Prenom Vide.')
		res.redirect('/create')
	}
	else if (req.body.cmail === undefined || req.body.cmail === '')
	{
		req.flash('error', 'Email Vide.')
		res.redirect('/create')
	}
	else if (req.body.cpasswd === undefined || req.body.cpasswd === '')
	{
		req.flash('error', 'Password Vide.')
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
								auth.create(req.body.clogin, req.body.cfirstname, req.body.clastname, req.body.cmail, hash)
								req.flash('succes', 'Compte créé.')
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
	var fistname = req.session.user.firstname
	var lastname = req.session.user.lastname
	var pass = req.session.user.passwd
	var mail = req.session.user.mail
	if (req.body.clastname !== undefined && req.body.clastname !== '')
		lastname = req.body.clastname
	if (req.body.cfirstname !== undefined && req.body.cfirstname !== '')
		firstname = req.body.cfirstname
	if (req.body.cmail !== undefined && req.body.cmail !== '')
		mail = req.body.cmail
	if (!re.test(mail))
	{
		req.flash('error', 'Email non valide.')
		res.redirect('/compte')
	}
	else if (req.body.cpasswd !== undefined && req.body.cpasswd !== '')
	{
		var num = /[0-9]/
		var min = /[a-z]/
		var maj = /[A-Z]/
		if (num.test(req.body.cpasswd) && min.test(req.body.cpasswd) && maj.test(req.body.cpasswd) && req.body.cpasswd.length > 7)
		{
			bcrypt.hash(req.body.cpasswd, 10, (err, hash) => {
				auth.compte(req.session.user.id, req.body.cfirstname, req.body.clastname, req.body.cmail, hash)
				req.flash('succes', 'Compte modifie.')
			})
			res.redirect('/')
		}
		else
		{
			req.flash('error', 'Votre mot de passe n\'est pas assez complique.')
			res.redirect('/compte')
		}
	}
	else
	{
		auth.compte(req.session.user.id, firstname, lastname, mail, pass)
		req.flash('succes', 'Compte modifie.')
		res.render('auth/compte')
	}
}

exports.home = (req, res) => {
	res.render('index')
}

exports.logout = (req, res) => {
	if (req.session.user)
	{
		req.session.user = undefined
	}
	res.redirect('/')
}
