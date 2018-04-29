var notif = require('../modele/notif')
module.exports =(req, res, next) => {
	if (req.session.user) {
		notif.newnotif(req.session.user.id, (rows) => {
			if (rows[0]) 
				res.locals.nbnotif = rows[0].nbnotif
			else
				res.locals.notif = 0
			next()
		})
	}
	else
		next()
}
