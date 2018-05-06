//<span class="badge badge-success">Success</span>
window.onload= function(){
	$('.chatlogin').click(function() {
		if ($('#iframechat')[0]) {
			if ($('#iframechat').hasClass('d-none')) {
				$('#iframechat').removeClass('d-none')
				$('.chatlogin').removeClass('fixbot')
			}
			else {
				$('#iframechat').addClass('d-none')
				$('.chatlogin').addClass('fixbot')
			}
		}
	  })
	console.log($('#iframechat').contents().find('#message'))
}

$(function() {
	
		            //$erreur.css('display', 'block'); // on affiche le message d'erreur



	function verif(champ, lenmax, lenmin, type) {
		var err = true
		if (champ.val() == "" || champ.val().length < lenmin || champ.val().length > lenmax) {
			err = false
		}
		else if (type == 1)
		{
			var rec = /[0-9]/
			var remin = /[a-z]/
			var remaj = /[A-Z]/
			err = (rec.test(champ.val()) && remin.test(champ.val()) && remaj.test(champ.val()))
		
		}
		else if (type == 2)
		{
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
			err = re.test(champ.val())
		}
		if (!err)
		{
			champ.css({
					borderColor : 'red',
				})
			return false
		}
		else
		{
			champ.css({
					borderColor : 'green',
					color : 'green'
				})
			return true
		}
	}

		if ($('#flogin')[0]) {
			$('form').submit(function() {
				var login = verif($('#llogin'), 30, 1, 0)
				var pass = verif($('#lpasswd'), 30, 8, 1)
				if (!login || !pass)
					return false
			})
		
		}
		if ($('#fforgot')[0]) {
			$('form').submit(function() {
				var mail = verif($('#fmail'), 50, 1, 2)
				if (!mail)
					return false
			})
		
		}
		if ($('#fcompte')[0]) {
			$('form').submit(function() {
				var mail = verif($('#cemail'), 50, 1, 2)
				var firstname = verif($('#cfirstname'), 30, 1, 0)
				var lastname = verif($('#clastname'), 30, 1, 0)
				var pass = verif($('#cpasswd'), 30, 8, 1)
				if ((!pass && $('#cpasswd').val() != "") || !mail || !firstname || !lastname)
					return false
			})
		
		}
		if ($('#fcreate')[0]) {
			console.log('flogin')
			$('form').submit(function() {
				var login = verif($('#clogin'), 30, 1, 0)
				var mail = verif($('#cemail'), 50, 1, 2)
				var firstname = verif($('#cfirstname'), 30, 1, 0)
				var lastname = verif($('#clastname'), 30, 1, 0)
				var pass = verif($('#cpasswd'), 30, 8, 1)
				if (!login || !pass || !mail || !firstname || !lastname)
					return false
			})
		
		}

		if ($('#match')[0] && $('#iduser')[0]) {
			$('#match').click(function(e){
				e.preventDefault()
				if ($('#matchey')[0]) {
					$.ajax({
						url : '/like/' + $('#iduser').text(),
						type : 'GET'
					});
					$('#matchey').remove()
					$('#match').append("<a href='/unlike/" + $('#iduser').text() + "'  id='matchen' class='badge badge-primary'>Ne plus matcher</a>")
				}
				else {
					$.ajax({
						url : '/unlike/' + $('#iduser').text(),
						type : 'GET'
					});
					$('#matchen').remove()
					$('#match').append("<a href='/like/" + $('#iduser').text() + "'  id='matchey' class='badge badge-primary'>Matcher</a>")
				}
			})
		}

		var socket = io.connect()
		socket.on('notif', function(notif) {
			$('#zonetmpnotif').append('<div id=tmpnotif> ' + notif.user + notif.data + '</div>')
			setTimeout(function(){$('#tmpnotif').remove()}, 3000)
			
			$('#notif').text(parseInt($('#notif').text()) + 1)
		})
		/*if ($('#message')[0]) {
			console.log('chat')
			$('#message').scrollTop(1E10)
			$('form').submit(function() {
				var msg = {
					"user" : $('#login').text(),
					"data" : $('#m').val()
				}
				socket.emit('chat message', msg)
				$('#message').append($('<li>').text('Vous : ' + msg.data))
				$('#message').scrollTop(1E10)
				$('#m').val('')
				return false
			})
			socket.on('chat message', function(msg) {
				if (msg.user === $('#login').text())
					$('#message').append($('<li>').text(msg.user + ' : ' + msg.data))
					$('#message').scrollTop(1E10)
			})
		}*/
})




/*if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function (pos) {
		console.log(pos)
	})
}*/


