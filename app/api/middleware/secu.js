module.exports = (req, res, next) => {
	if (req.originalUrl.substr(-1, 1) === '/' && req.originalUrl !== '/') {
		res.redirect(req.originalUrl.substr(0,req.originalUrl.length-1))
	}
	else {
		var ente = req.originalUrl.split('?')
		if (req.originalUrl === '/' || req.originalUrl === '/login' || req.originalUrl === '/create' || req.originalUrl === '/forgot' || ente[0] === '/resetmdp' || ente[0] === '/validation' || req.originalUrl === '/resendmail') {
			if (req.session.user)
				res.redirect('/sall')
			else
				next()
		}
		else if (req.session.user && (req.originalUrl === '/compte' || req.originalUrl === '/profil' || req.originalUrl === '/upload' || req.originalUrl === '/localisation' || req.originalUrl === '/addtag' || req.originalUrl.substr(0, 5) === '/tag/'))
			next()
		else if (req.session.user) {
			var pro = require('../modele/profil.js')
			var tmp = 0
			pro.getprofil (req.session.user.id, (rows) => {
				if (rows[0] && rows[0].bio && rows[0].genre && rows[0].orientation && rows[0].lat && rows[0].lng)
				{
					if (rows[0].img_profil === 1)
						next()
					else {
						req.flash('error', 'Pour terminer, ajoutez une photo de profil')
						res.redirect('/profil')
					}
				}
				else
				{
					req.flash('error', 'Completez votre profil')
					res.redirect('/profil')
				}
			})
		}
		else
		{
			res.redirect('/')
		}
	}
}
