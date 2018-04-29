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

	bdd.query("CREATE TABLE IF NOT EXISTS users (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, login VARCHAR(255) UNIQUE, mail VARCHAR(255) UNIQUE, firstname VARCHAR(255), lastname VARCHAR(255), passwd TEXT, date DATE, lastco DATETIME)", (err, result) => {
		if (err) throw err;
		console.log('table users ok');
	});

	bdd.query("CREATE TABLE IF NOT EXISTS rmdp (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, code VARCHAR(255) UNIQUE, id_user INT UNSIGNED UNIQUE, INDEX r_id_user (id_user), FOREIGN KEY (id_user) REFERENCES users(id))", (err, result) => {
		if (err) throw err;
		console.log('table rmdp ok');
	});


	bdd.query("CREATE TABLE IF NOT EXISTS profil (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, pop INT UNSIGNED DEFAULT '0', img_profil INT UNSIGNED DEFAULT '0', geolocalise INT UNSIGNED DEFAULT '0', id_user INT UNSIGNED, genre INT(2), orientation INT(3), bio TEXT, age INT UNSIGNED, ville VARCHAR(255), lat DECIMAL(12, 8), lng DECIMAL(12, 8), INDEX c_id_user (id_user), FOREIGN KEY (id_user) REFERENCES users(id))", (err, result) => {
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
		console.log('table tlike ok');
	});


	bdd.query("CREATE TABLE IF NOT EXISTS blist (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, id_bloqueur INT UNSIGNED, id_bloque INT UNSIGNED, INDEX c_id_bloqueur (id_bloqueur), FOREIGN KEY (id_bloqueur) REFERENCES users(id), INDEX c_id_bloque (id_bloque), FOREIGN KEY (id_bloque) REFERENCES users(id))", (err, result) => {
		if (err) throw err;
		console.log('table blist ok');
	});

	bdd.query("CREATE TABLE IF NOT EXISTS history (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, action VARCHAR(255), id_visiteur INT UNSIGNED, id_visite INT UNSIGNED, heure DATETIME, INDEX c_id_visiteur (id_visiteur), FOREIGN KEY (id_visiteur) REFERENCES users(id), INDEX c_id_visite (id_visite), FOREIGN KEY (id_visite) REFERENCES users(id))", (err, result) => {
		if (err) throw err;
		console.log('table history ok');
	});


	bdd.query("CREATE TABLE IF NOT EXISTS chat (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, message VARCHAR(255), login_posteur  VARCHAR(255), login_destinataire VARCHAR(255), heure DATETIME, INDEX c_login_posteur (login_posteur), FOREIGN KEY (login_posteur) REFERENCES users(login), INDEX c_login_destinataire (login_destinataire), FOREIGN KEY (login_destinataire) REFERENCES users(login))", (err, result) => {
		if (err) throw err;
		console.log('table chat ok');
	});

	bdd.query("CREATE TABLE IF NOT EXISTS notif (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, action VARCHAR(255), id_notifieur INT UNSIGNED, id_notifie INT UNSIGNED, heure DATETIME, vu INT UNSIGNED DEFAULT '0', INDEX c_id_notifieur (id_notifieur), FOREIGN KEY (id_notifieur) REFERENCES users(id), INDEX c_id_notifie (id_notifie), FOREIGN KEY (id_notifie) REFERENCES users(id))", (err, result) => {
		if (err) throw err;
		console.log('table notif ok');
	});
});
