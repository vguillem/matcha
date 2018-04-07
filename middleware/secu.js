module.exports = (req, res, next) => {
	if (req.session.user || req.originalUrl === '/' || req.originalUrl === '/login' || req.originalUrl === '/create' || req.originalUrl === '/forgot') {
		next()
	}
	else
	{
		res.redirect('/')
	}
}
