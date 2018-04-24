module.exports = (req, res, next) => {
	var ente = req.originalUrl.split('?')
	if (req.session.user || req.originalUrl === '/' || req.originalUrl === '/login' || req.originalUrl === '/create' || req.originalUrl === '/forgot' || ente[0] === '/resetmdp') {
		next()
	}
	else
	{
		res.redirect('/')
	}
}
