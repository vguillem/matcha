module.exports =(req, res, next) => {
	if (req.session.actualpage) {
		req.session.lastpage = req.session.actualpage
	}
	else
		req.session.lastpage = '/'
	req.session.actualpage = req.originalUrl
		
	next()
}
