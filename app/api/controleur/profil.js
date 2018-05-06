var fs = require('fs')
var getCoords = require ('city-to-coords')
var readchunk = require('read-chunk')
var isPng = require('is-png')

exports.unlike = (req, res) => {
	var hist = require('../modele/hist.js')
	var pro = require('../modele/profil.js')
	var notif = require('../modele/notif.js')
	pro.unlike(req.session.user.id, req.params.id)
	if (req.session.lastpage.substr(0, 5) !== '/user') {
		hist.unlike(req.session.user.id, req.params.id)
		pro.uppop(req.params.id, -10)
		pro.getlike(req.session.user.id, req.params.id, (rows) => {
			if (rows[0])
				notif.munlike(req.session.user.id, req.params.id)
			else
				notif.unlike(req.session.user.id, req.params.id)
		
			res.redirect(req.session.lastpage)
		})
		}
	else
		res.redirect(req.session.lastpage)
}

exports.like = (req, res) => {
	var pro = require('../modele/profil.js')
	var hist = require('../modele/hist.js')
	var notif = require('../modele/notif.js')
	pro.unlike(req.session.user.id, req.params.id)
	pro.like(req.session.user.id, req.params.id)
	hist.like(req.session.user.id, req.params.id)
	pro.uppop(req.params.id, 10)
	pro.getlike(req.session.user.id, req.params.id, (rows) => {
		if (rows[0])
			notif.mlike(req.session.user.id, req.params.id)
		else
			notif.like(req.session.user.id, req.params.id)
	
		res.redirect(req.session.lastpage)
	})
}



exports.getnotif = (req, res) => {
	var notif = require('../modele/notif.js')
	notif.vunotif(req.session.user.id)
	notif.getnotif(req.session.user.id, (rows) => {
		if (rows[0])
			res.locals.notif = rows
		res.render('notif/notif')
	})
}


exports.localisation = (req, res) => {
	var pro = require('../modele/profil.js')
	if (req.body.pcoordonnees) {
		getCoords(req.body.pcoordonnees)
		.then((coords) => {
			pro.localisation(req.session.user.id, req.body.pcoordonnees, coords.lat, coords.lng)
			req.flash('succes', 'Ville ajoutée')
			res.redirect('/profil')
		}).catch((err) => {
			req.flash('error', 'Ville invalide')
			res.redirect('/profil')
		})
	}
	else
		res.redirect('/profil')
}

exports.getprofil = (req, res) => {
	var pro = require('../modele/profil.js')
	if (!req.session.user)
		res.render('profil/profil')
	else {
		pro.getprofil (req.session.user.id, (rows) => {
			if (rows[0])
			{
				res.locals.gprofil = rows[0]
				pro.selecttag (req.session.user.id, (row) => {
					res.locals.tag = []
					var i = 0
					while (row[i])
						res.locals.tag[i] = row[i++].tag
					res.render('profil/profil')
				})
			}
			else {
				res.render('profil/profil')
			}
		})
	}
}

exports.deltag = (req, res) => {
	var pro = require('../modele/profil.js')
	if (!req.session.user)
		res.redirect('/profil')
	else {
		pro.deltag(req.session.user.id, req.params.id)
		res.redirect('/profil')
	}
}

exports.addtag = (req, res) => {
	if (req.body.ptag)
	{
		var pro = require('../modele/profil.js')
		if (req.body.ptag.length > 27)
		{
			req.flash('error', 'Tag invalide')
		}
		else {
			pro.addtag (req.session.user.id, req.body.ptag)
			req.flash('succes', 'Tag ajoute')
		}
	}
	res.redirect('/profil')
}

exports.upload = (req, res) => {
	var fstream
	var pro = require('../modele/profil.js')
	req.pipe(req.busboy)
	var promises = []
	var allimgok = 1
	req.busboy.on('file', (fieldname, file, filename) => {
		var promise = new Promise((resolve) => {
			if (filename !== '') {
				var pathimg = __dirname + '/../public/upload/' + req.session.user.id
				var finimg = false
				if (fieldname === 'img1')
					finimg = '-1.png'
				else if (fieldname === 'img2')
					finimg = '-2.png'
				else if (fieldname === 'img3')
					finimg = '-3.png'
				else if (fieldname === 'img4')
					finimg = '-4.png'
				else if (fieldname === 'img5')
					finimg = '-5.png'
				if (finimg) {
					fstream = fs.createWriteStream(pathimg + finimg)
					file.pipe(fstream)
					fstream.on('close', () => {
						var type = readchunk.sync(pathimg + finimg, 0, 8)
						if (!isPng(type))
						{
							allimgok = 2
							fs.unlink(pathimg + finimg, (err) => {
								resolve('erreur')
								if (err) throw err
							})
						}
						else {
							if (finimg === '-1.png')
								pro.img_profil_ok(req.session.user.id)
							resolve('ok')
						}
					})
				}
				else
				{
					allimgok = 2
					resolve('erreur')
				}
			}
			promises.push(promise);
		})
	})
	Promise.all(promises)
		.then(uplo => {
			if (allimgok === 1)
				req.flash('succes', 'Photo uplode')
			else
				req.flash('error', 'fichier invalide')
			res.redirect('/profil')
		})
}

exports.profil = (req, res) => {
	var pro = require('../modele/profil.js')
	pro.getprofil(req.session.user.id, (rows) => {
		if (rows[0])
		{
			var age
			var genre
			var bio
			var orientation
			if (req.body.pbio === undefined || req.body.pbio === '')
				bio = rows[0].bio
			else
				bio = req.body.pbio
			if (req.body.page === undefined || req.body.page === '' || req.body.page < 18 || req.body.page > 130)
				age = rows[0].age
			else
				age = req.body.page
			if (req.body.pgenre === undefined || req.body.pgenre === '')
				genre = rows[0].genre
			else
				genre = req.body.pgenre
			if (req.body.porientation === undefined || req.body.porientation === '')
				orientation = rows[0].orientation
			else
				orientation = req.body.porientation
			pro.upprofil(req.session.user.id, age, genre, bio, orientation)
			req.flash('succes', 'Profil mis a jour.')
			res.redirect('/profil')
		}
		else if (req.body.pbio === undefined || req.body.pbio === '')
		{
			req.flash('error', 'Biographie vide.')
			res.redirect('/profil')
		}
		else if (req.body.page === undefined || req.body.page === '' || req.body.page < 18 || req.body.page > 130)
		{
			req.flash('error', 'Age incorrect.')
			res.redirect('/profil')
		}
		else if (req.body.pgenre === undefined || req.body.pgenre === '')
		{
			req.flash('error', 'Genre vide.')
			res.redirect('/profil')
		}
		else if (req.body.porientation === undefined || req.body.porientation === '')
		{
			req.flash('error', 'Orientation vide.')
			res.redirect('/profil')
		}
		else {
			pro.create(req.session.user.id, req.body.page, req.body.pgenre, req.body.pbio, req.body.porientation)
			req.flash('succes', 'Profil mis a jour.')
			res.redirect('/profil')
		}
	})
}
