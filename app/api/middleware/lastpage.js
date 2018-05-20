module.exports =(req, res, next) => {
	if (req.originalUrl !== '/favicon.ico' && req.originalUrl !== '/404') {
	if (req.session.actualpage) {
		req.session.lastpage = req.session.actualpage
	}
	else
		req.session.lastpage = '/'
	req.session.actualpage = req.originalUrl
	}
	next()
}
