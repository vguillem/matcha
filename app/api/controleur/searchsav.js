exports.sall = (req, res) => {
	var pro = require('../modele/profil.js')
	var search = require('../modele/search.js')
	if (req.session.user)
		pro.getprofil (req.session.user.id, (rows) => {
			if (rows[0] && rows[0].bio !== NULL)
			{
			console.log(rows[0].bio)
				if (res.locals.profil)
				{
					search.all (req.session.user.id, rows[0].genre, rows[0].orientation, (rows2) => {
						var i = 0
						res.locals.tag = []
						res.locals.like = []
						res.locals.reput = []
						var promises = []
						while (rows2[i]) {
							let tmp = rows2[i].id_user
							res.locals.tag[tmp] = []
							var promise2 = new Promise((resolve) => {
								pro.checklike(req.session.user.id, tmp, (like) => {
									if (like[0])
										res.locals.like[tmp] = true
									else
										res.locals.like[tmp] = false
									resolve(res.locals.like[tmp])
								})
							})
							var promise = new Promise((resolve) => {
								pro.selecttag(tmp, (tag) => {
									let j = 0
									while (tag[j])
										res.locals.tag[tmp][j] = tag[j++].tag
									resolve(res.locals.tag[tmp])
								})
							})
							var promise3 = new Promise((resolve) => {
								pro.reput(tmp, (rep) => {
									res.locals.reput[tmp] = rep.length
									resolve(res.locals.reput[tmp])
								})
							})
							promises.push(promise);
							promises.push(promise2);
							promises.push(promise3);
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
