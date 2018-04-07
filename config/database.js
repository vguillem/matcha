var mysql = require('mysql');

var bdd = mysql.createConnection({
		host: "localhost",
		user: "matcha",
		password: "matcha",
		database: "matcha"
});

bdd.connect()

module.exports = bdd
