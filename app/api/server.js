var express = require('express')
var app = express()
var http = require('http').createServer(app)
var bodyparser = require('body-parser')
var Session = require('express-session')
var Auth = require('./controleur/auth')
var Profil = require('./controleur/profil')
var Chat = require('./controleur/chat')
var Blist = require('./controleur/blist')
var Search = require('./controleur/search')
var fs = require('fs')
var busboy = require('connect-busboy')
var io = require('socket.io')(http)
var sharedsession = require("express-socket.io-session")
var Sock = require('./modele/sock.js')
var bddauth = require('./modele/auth.js')
var session = Session({
	secret: 'nqwnqw',
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false}
})
var notif = require('./modele/notif')

// Template
app.set('view engine', 'ejs')

// Middleware
app.use(express.static('public'))
app.use(express.static(__dirname + '/node_modules'))
app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(busboy())
app.use(session)
app.use(require('./middleware/flash'))
app.use(require('./middleware/login'))
app.use(require('./middleware/secu'))
app.use(require('./middleware/profil'))
app.use(require('./middleware/lastco'))
app.use(require('./middleware/notif'))
app.use(require('./middleware/lastpage'))
app.use(require('./middleware/chat'))
io.use(sharedsession(session, {
    autoSave:true
}));


// Routes
var users = {}
io.sockets.on('connection', (socket) => {
    if (socket.handshake.session.user)
	{
		users[socket.handshake.session.user.login] = socket.id
		users[socket.handshake.session.user.id] = socket.id
		socket.on('chat message', (msg)=> {
			Sock.newmessage(msg.user, socket.handshake.session.user.id, socket.handshake.session.user.login, msg.data, (rows) => {
				if (rows[0]) {
					socket.broadcast.to(users[msg.user]).emit('chat message', {
						user : socket.handshake.session.user.login,
						data : msg.data,
					})
					bddauth.login(msg.user, (rows2) => {
							notif.chatnotif(socket.handshake.session.user.id, rows2[0].id)
							io.sockets.to(users[rows2[0].id]).emit('notif',  {
								user : socket.handshake.session.user.login,
								data : ' vous a envoye un message',
							})
					})
				}
			})
		})
	}
})

app.get('/', (req, res) => {
	Auth.home(req, res)
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


app.post('/localisation', (req, res) => {
	Profil.localisation(req, res)
})


app.get('/compte', (req, res) => {
	Auth.compteget(req, res)
})
app.post('/compte', (req, res) => {
	Auth.compte(req, res)
})


app.get('/forgot', (req, res) => {
	if(req.session.user)
		res.redirect('/sall')
	else
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
	Search.sallpost(req, res)
})

app.post('/sall', (req, res) => {
	Search.sallpost(req, res)
})

app.get('/user', (req, res) => {
	var id = req.query.id
	if (isNaN(id)) {
		res.redirect('/sall')
	}
	else {
		Search.user(req, res)
		io.sockets.to(users[id]).emit('notif',  {
			user : req.session.user.login,
			data : ' a visite votre profil'
		})
	}
})


app.get('/unlike/:id', (req, res) => {
	var id = req.params.id
	if (isNaN(id)) {
		res.redirect('/sall')
	}
	else {
		Profil.unlike(req, res)
		io.sockets.to(users[id]).emit('notif',  {
			user : req.session.user.login,
			data : ' a arrete de vous match'
		})
	}
})

app.get('/like/:id', (req, res) => {
	var id = req.params.id
	if (isNaN(id)) {
		res.redirect('/sall')
	}
	else {
		Profil.like(req, res)
		io.sockets.to(users[id]).emit('notif',  {
			user : req.session.user.login,
			data : ' vous a match'
		})
	}
})

app.get('/chat', (req, res) => {
	Chat.chat(req, res)
})


app.get('/chats', (req, res) => {
	Chat.chats(req, res)
})


app.get('/resetmdp', (req, res) => {
	Auth.resetmdp(req, res)
})


app.post('/resetmdp', (req, res) => {
	Auth.resetmdppost(req, res)
})


app.get('/notif', (req, res) => {
	Profil.getnotif(req, res)
})


app.get('/blist', (req, res) => {
	Blist.getblist(req, res)
})


app.get('/dellblist/:id', (req, res) => {
	Blist.dellblist(req, res)
})


app.get('/addblist/:id', (req, res) => {
	Blist.addblist(req, res)
})


app.get('/report/:id', (req, res) => {
	Blist.report(req, res)
})

app.get('/ichat', (req, res) => {
	Chat.ichat(req, res)
})


app.get('/404', (req, res) => {
	res.render('404')
})


app.use((req, res, next) => {
	res.status(404).redirect('/404')
})

http.listen(8100)
