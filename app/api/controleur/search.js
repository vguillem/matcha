exports.sall = (req, res) => {
	var pro = require('../modele/profil.js')
	var search = require('../modele/search.js')
	if (req.session.user)
		pro.getprofil (req.session.user.id, (rows) => {
			if (rows[0])
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
								res.render('search/all')
							})
					})
				}
				else
					res.redirect('/profil')
			}
			else
				res.redirect('/profil')
		})
}
