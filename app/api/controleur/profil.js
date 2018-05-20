var fs = require('fs')
var Verif = require('../modele/verif.js')
var getCoords = require ('city-to-coords')
var readchunk = require('read-chunk')
var isPng = require('is-png')
var isJpg = require('is-jpg')

exports.unlike = (req, res) => {
	var hist = require('../modele/hist.js')
	var pro = require('../modele/profil.js')
	var notif = require('../modele/notif.js')
	if (!Verif.verif(req.params.id, 1, 0)) {
		res.redirect('/sall')
	}
	else {
		pro.checklike (req.session.user.id, req.params.id, (rows1) => {
			if (rows1[0]) {
				pro.uppop(req.params.id, -10)
				pro.unlike(req.session.user.id, req.params.id)
				if (req.session.lastpage.substr(0, 5) !== '/user') {
					hist.unlike(req.session.user.id, req.params.id)
					pro.getlike(req.session.user.id, req.params.id, (rows) => {
						if (rows[0])
							notif.munlike(req.session.user.id, req.params.id)
						else
							notif.unlike(req.session.user.id, req.params.id)
					})
				}
			}
		})
		res.redirect(req.session.lastpage)
	}
}

exports.like = (req, res) => {
	if (!Verif.verif(req.params.id, 1, 0)) {
		res.redirect('/sall')
	}
	else {
		var pro = require('../modele/profil.js')
		var hist = require('../modele/hist.js')
		var notif = require('../modele/notif.js')
		pro.checklike (req.session.user.id, req.params.id, (rows1) => {
			if (!rows1[0]) {
				pro.like(req.session.user.id, req.params.id)
				hist.like(req.session.user.id, req.params.id)
				pro.uppop(req.params.id, 10)
				pro.getlike(req.session.user.id, req.params.id, (rows) => {
					if (rows[0])
						notif.mlike(req.session.user.id, req.params.id)
					else
						notif.like(req.session.user.id, req.params.id)
				})
			}
			res.redirect(req.session.lastpage)
		})
	}
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
	if (Verif.verif(req.body.pcoordonnees, 0, 250)) {
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
			try {
				fs.accessSync('public/upload/' + req.session.user.id + '-1.png')
				var tmp = 'upload/' + req.session.user.id + '-1.png'
				res.locals.profil = tmp
				} catch(err) {
				}
			try {
				fs.accessSync('public/upload/' + req.session.user.id + '-2.png')
				var tmp = 'upload/' + req.session.user.id + '-2.png'
				res.locals.imgprof1 = tmp
				} catch(err) {}
			try {
				fs.accessSync('public/upload/' + req.session.user.id + '-3.png')
				var tmp = 'upload/' + req.session.user.id + '-3.png'
				res.locals.imgprof2 = tmp
				} catch(err) {}
			try {
				fs.accessSync('public/upload/' + req.session.user.id + '-4.png')
				var tmp = 'upload/' + req.session.user.id + '-4.png'
				res.locals.imgprof3 = tmp
				} catch(err) {}
			try {
				fs.accessSync('public/upload/' + req.session.user.id + '-5.png')
				var tmp = 'upload/' + req.session.user.id + '-5.png'
				res.locals.imgprof4 = tmp
				} catch(err) {}

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

exports.deltag = (req, res) => {
	if (!Verif.verif(req.params.id, 0, 27)) {
		res.redirect('/sall')
	}
	else {
		var pro = require('../modele/profil.js')
		pro.deltag(req.session.user.id, req.params.id)
		res.redirect('/profil')
	}
}

exports.addtag = (req, res) => {
	if (Verif.verif(req.body.ptag, 0, 27))
	{
		var pro = require('../modele/profil.js')
		pro.addtag (req.session.user.id, req.body.ptag)
		req.flash('succes', 'Tag ajoute')
	}
	else {
		req.flash('error', 'Tag invalide')
	}
	res.redirect('/profil')
}

exports.upload = (req, res) => {
	var fstream
	var pro = require('../modele/profil.js')
	req.pipe(req.busboy)
	req.busboy.on('file', (fieldname, file, filename) => {
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
				fstream.on('finish', () => {
					var type = readchunk.sync(pathimg + finimg, 0, 8)
					if (!isPng(type) && !isJpg(type))
					{
						if (finimg === '-1.png')
							pro.img_profil_ko(req.session.user.id)
						fs.unlink(pathimg + finimg, (err) => {
							if (err) throw err
						})
						req.flash('error', 'fichier invalide')
					}
					else {
						if (finimg === '-1.png')
							pro.img_profil_ok(req.session.user.id)
						req.flash('succes', 'Photo uplode')
					}
					if (fieldname === 'img1' || fieldname === 'img5')
						res.redirect('/profil')
				})
				file.pipe(fstream)
			}
		}
		else {
			if (fieldname === 'img1' || fieldname === 'img5')
				res.redirect('/profil')
		}
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
			if (!Verif.verif(req.body.pbio, 0, 250))
				bio = rows[0].bio
			else
				bio = req.body.pbio
			if (!Verif.verif(req.body.page, 1, 0) || req.body.page < 18 || req.body.page > 130)
				age = rows[0].age
			else
				age = req.body.page
			if (!Verif.verif(req.body.pgenre, 1, 0) || req.body.pgenre < 1 || req.body.pgenre > 2)
				genre = rows[0].genre
			else
				genre = req.body.pgenre
			if (!Verif.verif(req.body.porientation, 1, 0) || req.body.porientation < 1 || req.body.porientation > 3)
				orientation = rows[0].orientation
			else
				orientation = req.body.porientation
			pro.upprofil(req.session.user.id, age, genre, bio, orientation)
			req.flash('succes', 'Profil mis a jour.')
			res.redirect('/profil')
		}
		else if (!Verif.verif(req.body.pbio, 0, 250))
		{
			req.flash('error', 'Biographie vide.')
			res.redirect('/profil')
		}
		else if (!Verif.verif(req.body.page, 1, 0) || req.body.page < 18 || req.body.page > 130)
		{
			req.flash('error', 'Age incorrect.')
			res.redirect('/profil')
		}
		else if (!Verif.verif(req.body.pgenre, 1, 0) || req.body.page < 1 || req.body.page > 2)
		{
			req.flash('error', 'Genre vide.')
			res.redirect('/profil')
		}
		else if (!Verif.verif(req.body.porientation, 1, 0) || req.body.page < 1 || req.body.page > 3)
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
