var mysql = require('mysql');

var bdd = mysql.createConnection({
	host: "db",
	user: "matcha",
	password: "matcha"
});

bdd.connect((err) => {
	if (err) throw err;
	bdd.query("CREATE DATABASE IF NOT EXISTS matcha", (err, result) => {
		if (err) throw err;
		console.log('Matcha ok');
	});

	bdd.query("USE matcha", (err, result) => {
		if (err) throw err;
		console.log('Use matcha OK');
	})

	bdd.query("CREATE TABLE IF NOT EXISTS users (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, login VARCHAR(255), mail VARCHAR(255), firstname VARCHAR(255), lastname VARCHAR(255), passwd TEXT, date DATE)", (err, result) => {
		if (err) throw err;
		console.log('table users ok');
	});

	bdd.query("CREATE TABLE IF NOT EXISTS profil (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, id_user INT UNSIGNED, genre INT(2), orientation INT(3), bio TEXT, age INT UNSIGNED, INDEX c_id_user (id_user), FOREIGN KEY (id_user) REFERENCES users(id))", (err, result) => {
		if (err) throw err;
		console.log('table profil ok');
	});

	bdd.query("CREATE TABLE IF NOT EXISTS tag (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, tag VARCHAR(255))", (err, result) => {
		if (err) throw err;
		console.log('table tag ok');
	});

	bdd.query("CREATE TABLE IF NOT EXISTS join_tag (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, id_tag INT UNSIGNED, id_user INT UNSIGNED, INDEX c_id_tag (id_tag), FOREIGN KEY (id_tag) REFERENCES tag(id), INDEX c_id_user (id_user), FOREIGN KEY (id_user) REFERENCES users(id))", (err, result) => {
		if (err) throw err;
		console.log('table join_tag ok');
	});

	bdd.query("CREATE TABLE IF NOT EXISTS tlike (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, id_likeur INT UNSIGNED, id_liker INT UNSIGNED, INDEX c_id_likeur (id_likeur), FOREIGN KEY (id_likeur) REFERENCES users(id), INDEX c_id_liker (id_liker), FOREIGN KEY (id_liker) REFERENCES users(id))", (err, result) => {
		if (err) throw err;
		console.log('table join_tag ok');
	});
});
