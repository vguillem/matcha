function verif(data, type, len){
	if (data === undefined || data === '' || (data.length > len && len !== 0))
		return false
	if (type === 1) {
		if (isNaN(data))
			return false
	}
	return true
}
function sortBynbtag( a, b )
{
	var x = b.nbtag;
	var y = a.nbtag;
	return ((x < y) ? -1 : ((x > y) ? 1 : 0));
}


exports.sallpost = (req, res) => {
	var hist = require('../modele/hist.js')
	var pro = require('../modele/profil.js')
	var search = require('../modele/search.js')
	var agemin = req.body.agemin
	var agemax = req.body.agemax
	var distmin = req.body.distmin
	var distmax = req.body.distmax
	var popmin = req.body.popmin
	var popmax = req.body.popmax
	var ctag = req.body.stag
	var tri = req.body.filt
	if (!tri)
		tri = 'tag'
	else if (tri === 'Distance')
		tri = 'distance'
	else if (tri === 'Popularite')
		tri = 'pop'
	else if (tri === 'tag')
		tri = 'tag'
	else if (tri === 'Age')
		tri = 'age'
	else
		tri = 'uid'
	if (req.session.user) {
		pro.getprofil (req.session.user.id, (rows) => {
			if (rows[0] && rows[0].bio && rows[0].genre && rows[0].orientation && rows[0].lat && rows[0].lng)
			{
				if (res.locals.profil)
				{
					if (rows[0].idtag)
						var filtre_tag = rows[0].idtag.split(',')
					if (!verif(agemin, 1, 1000000000))
						agemin = rows[0].age - 10
					if (!verif(agemax, 1, 1000000000))
						agemax = rows[0].age + 10
					if (!verif(distmin, 1, 1000000000))
						distmin = 0
					if (!verif(distmax, 1, 1000000000))
						distmax = 100
					if (!verif(popmin, 1, 1000000000))
						popmin = 0
					if (!verif(popmax, 1, 1000000000))
						popmax = 1000
					search.postall (req.session.user.id, rows[0].genre, rows[0].orientation, rows[0].lat, rows[0].lng, agemin, agemax, distmin, distmax, popmin, popmax, tri, (rows2) => {
						var i = 0
						while (rows2[i]) {
							rows2[i].show = 1
							if (rows2[i].tag)
								rows2[i].tags = rows2[i].tag.split(',')
							else
								rows2[i].tags = 0
							if (rows2[i].tag)
								rows2[i].idtag = rows2[i].idtag.split(',')
							else if (ctag)
								rows2[i].show = 0
							rows2[i].nbtag = 0
							rows2[i].dell = 0
							if ((tri === 'tag' || ctag) && rows2[i].idtag) {
								var j = 0
								while (rows2[i].idtag[j])
								{
									var k = 0
									if (ctag) {
										if (Array.isArray(ctag)) {
											while (ctag[k])
											{
												if (parseInt(rows2[i].idtag[j]) === parseInt(ctag[k]))
													rows2[i].dell++
												k++
											}
										}
										else
										{
											if (parseInt(rows2[i].idtag[j]) === parseInt(ctag))
												rows2[i].dell++
										}
									}
									if (tri === 'tag' && filtre_tag) {
										if (Array.isArray(filtre_tag)) {
											while (filtre_tag[k])
											{
												if (parseInt(rows2[i].idtag[j]) === parseInt(filtre_tag[k]))
													rows2[i].nbtag++
												k++
											}
										}
										else
										{
											if (parseInt(rows2[i].idtag[j]) === parseInt(filtre_tag))
												rows2[i].nbtag++
										}
									}
									j++
								}
								if (ctag)
								{
									if (Array.isArray(ctag)) {
										if (ctag.length !== rows2[i].dell)
											rows2[i].show = 0
									}
									else if (rows2[i].dell !== 1)
										rows2[i].show = 0
								}
							}
							i++
						}
						if (rows2[0])
						{
							res.locals.users = rows2
							if (tri === 'tag')
								res.locals.users = rows2.sort(sortBynbtag)
						}
						hist.get_hist(req.session.user.id, (rhist) => {
							if (rhist[0])
								res.locals.hist = rhist
							res.locals.filtre = []
							res.locals.filtre.agemin = agemin
							res.locals.filtre.agemax = agemax
							res.locals.filtre.popmin = popmin
							res.locals.filtre.popmax = popmax
							res.locals.filtre.distmin = distmin
							res.locals.filtre.distmax = distmax
							pro.searchtag((stag) => {
								res.locals.filtre.stag = stag
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
	var pro = require('../modele/profil.js')
	var chat = require('../modele/chat.js')
	var search = require('../modele/search.js')
	var hist = require('../modele/hist.js')
	var notif = require('../modele/notif.js')
	var id = req.query.id


	pro.getprofil (req.session.user.id, (rows) => {
		if (rows[0] && rows[0].bio && rows[0].genre && rows[0].orientation && rows[0].lat && rows[0].lng)
		{
			if (res.locals.profil)
			{
				search.user(rows[0].lng, rows[0].lat, id, req.session.user.id, (rows3) => {
					if (rows3[0]) {
						chat.getchat(req.session.user.login, rows3[0].login, req.session.user.id, id, (rows2) => {
							var i = 0
							while (rows2[i]) {
								if (rows2[i].login_posteur === req.session.user.login)
									rows2[i].login_posteur = 'Vous'
								i++
							}
							res.locals.chat = rows2.reverse()
							hist.v_user(req.session.user.id, rows3[0].uid)
							notif.v_user(req.session.user.id, rows3[0].uid)
							pro.uppop(id, 1)
							if (rows3[0].tag)
								rows3[0].tags = rows3[0].tag.split(',')
							else
								rows3[0].tags = 0
							res.locals.users = rows3
							res.render('search/user')
						})
					}
					else
						res.redirect('/sall')
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
