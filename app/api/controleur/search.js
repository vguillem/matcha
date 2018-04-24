exports.sallpost = (req, res) => {
	var hist = require('../modele/hist.js')
	var pro = require('../modele/profil.js')
	var search = require('../modele/search.js')
	if (req.session.user) {
		pro.getprofil (req.session.user.id, (rows) => {
			if (rows[0] && rows[0].bio && rows[0].genre && rows[0].orientation)
			{
				if (res.locals.profil)
				{
				// verifier valeurs post
					var agemin = req.body.agemin
					var agemax = req.body.agemax
					var distmin = req.body.distmin
					var distmax = req.body.distmax
					var popmin = req.body.popmin
					var popmax = req.body.popmax
					search.postall (req.session.user.id, rows[0].genre, rows[0].orientation, rows[0].lat, rows[0].lng, agemin, agemax, distmin, distmax, popmin, popmax, (rows2) => {
						var i = 0
						res.locals.like = []
						var promises = []
						while (rows2[i]) {
							let tmp = rows2[i].id_user
							if (rows2[i].tag)
								rows2[i].tags = rows2[i].tag.split(',')
							else
								rows2[i].tags = 0
							var promise2 = new Promise((resolve) => {
								pro.checklike(req.session.user.id, tmp, (like) => {
									if (like[0])
										res.locals.like[tmp] = true
									else
										res.locals.like[tmp] = false
									resolve(res.locals.like[tmp])
								})
							})
							promises.push(promise2);
							i++
						}
						Promise.all(promises)
							.then(tags => {
								res.locals.users = rows2
								hist.get_hist(req.session.user.id, (rhist) => {
									if (rhist[0])
										res.locals.hist = rhist
									console.log(rows2)
									res.render('search/all')
								})
							})
					})
				}
				else
				{
					req.flash('error', 'Pour terminer, ajoutez une photo de profil')
					res.redirect('/profil')
				}
			}
			else
			{
				req.flash('error', 'Completez votre profil (age, genre, preference, bio, photo de profil.)')
				res.redirect('/profil')
			}
		})
	}
	else
		res.redirect('/')
}


exports.sall = (req, res) => {
	var hist = require('../modele/hist.js')
	var pro = require('../modele/profil.js')
	var search = require('../modele/search.js')
	if (req.session.user) {
		pro.getprofil (req.session.user.id, (rows) => {
			if (rows[0] && rows[0].bio && rows[0].genre && rows[0].orientation)
			{
				if (res.locals.profil)
				{
					search.all (req.session.user.id, rows[0].genre, rows[0].orientation, (rows2) => {
						var i = 0
						res.locals.like = []
						var promises = []
						while (rows2[i]) {
							let tmp = rows2[i].id_user
							if (rows2[i].tag)
								rows2[i].tags = rows2[i].tag.split(',')
							else
								rows2[i].tags = 0
							var promise2 = new Promise((resolve) => {
								pro.checklike(req.session.user.id, tmp, (like) => {
									if (like[0])
										res.locals.like[tmp] = true
									else
										res.locals.like[tmp] = false
									resolve(res.locals.like[tmp])
								})
							})
							promises.push(promise2);
							i++
						}
						Promise.all(promises)
							.then(tags => {
								res.locals.users = rows2
								hist.get_hist(req.session.user.id, (rhist) => {
									if (rhist[0])
										res.locals.hist = rhist
									res.render('search/all')
								})
							})
					})
				}
				else
				{
					req.flash('error', 'Pour terminer, ajoutez une photo de profil')
					res.redirect('/profil')
				}
			}
			else
			{
				req.flash('error', 'Completez votre profil (age, genre, preference, bio, photo de profil.)')
				res.redirect('/profil')
			}
		})
	}
	else
		res.redirect('/')
}


exports.user = (req, res) => {
	var search = require('../modele/search.js')
	var hist = require('../modele/hist.js')
	var id = req.query.id
	search.user(id, (rows) => {
		if (rows[0]) {
			hist.v_user(req.session.user.id, rows[0].uid)
			if (rows[0].tag)
				rows[0].tags = rows[0].tag.split(',')
			else
				rows[0].tags = 0
			res.locals.users = rows
			res.render('search/user')
		}
		else
			res.redirect('/sall')
	})
}
