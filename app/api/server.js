var express = require('express')
var app = express()
var http = require('http').createServer(app)
var bodyparser = require('body-parser')
var session = require('express-session')
var Auth = require('./controleur/auth')
var Profil = require('./controleur/profil')
var Sall = require('./controleur/search')
var fs = require('fs')
var busboy = require('connect-busboy')
var io = require('socket.io')(http)

// Template
app.set('view engine', 'ejs')

// Middleware
app.use(express.static('public'))
app.use(express.static(__dirname + '/node_modules'))
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(busboy())
app.use(session({
	secret: 'nqwnqw',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false}
}))
app.use(require('./middleware/flash'))
app.use(require('./middleware/login'))
app.use(require('./middleware/secu'))
app.use(require('./middleware/profil'))


// Routes
app.get('/', (req, res) => {
	Auth.home(req, res)
})

io.sockets.on('connection', (socket) => {
	socket.on('chat message', (msg)=> {
		io.sockets.emit('chat message', msg)
	})
})

app.get('/create', (req, res) => {
	res.render('auth/create')
})
app.post('/create', (req, res) => {
	Auth.create(req, res)
})


app.get('/login', (req, res) => {
	res.render('auth/login')
})

app.post('/login', (req, res) => {
	Auth.login(req, res)
})

app.get('/profil', (req, res) => {
	Profil.getprofil(req, res)
})
app.post('/profil', (req, res) => {
	Profil.profil(req, res)
})


app.get('/tag/:id', (req, res) => {
	Profil.deltag(req, res)
})


app.get('/compte', (req, res) => {
	res.render('auth/compte')
})
app.post('/compte', (req, res) => {
	Auth.compte(req, res)
})


app.get('/forgot', (req, res) => {
	res.render('auth/forgot')
})
app.post('/forgot', (req, res) => {
	Auth.forgot(req, res)
})


app.get('/logout', (req, res) => {
	Auth.logout(req, res)
})

app.post('/upload', (req, res) => {
	Profil.upload(req, res)
})

app.post('/addtag', (req, res) => {
	Profil.addtag(req, res)
})


app.get('/sall', (req, res) => {
	Sall.sall(req, res)
})

app.post('/user/:id', (req, res) => {
	res.render('chat/chat')
})


app.get('/unlike/:id', (req, res) => {
	Profil.unlike(req, res)
})

app.get('/like/:id', (req, res) => {
	Profil.like(req, res)
})

app.get('/chat', (req, res) => {
	res.render('chat/chat')
})


app.use((req, res, next) => {
	res.status(404).render('404')
})

http.listen(8100)
