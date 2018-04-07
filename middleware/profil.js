module.exports =(req, res, next) => {
	var fs = require('fs')
	if (req.session.user) {
		try {
			fs.accessSync('public/upload/' + req.session.user.id + '-1.png')
			var tmp = 'upload/' + req.session.user.id + '-1.png'
			res.locals.profil = tmp
			} catch(err) {}
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
	}
	next()
}

