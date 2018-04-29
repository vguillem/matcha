//<span class="badge badge-success">Success</span>
window.onload= function(){
	$('#foo').click(function() {
	  alert('User clicked on "foo."');
	  });
};

	$(function() {
		var socket = io.connect()
		socket.on('notif', function(notif) {
			console.log(notif)
			//$('#notif').text(notif)
		})
	})




/*if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function (pos) {
		console.log(pos)
	})
}*/








/*function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validate() {
  var email = $("#cemail").val();
  if (validateEmail(email)) {
  } else {
    $("#error").attr('class', 'alert alert-danger');
    $("#error").text("email : " + email + " is not valid");
  }
  return false;
}

$("#validate").bind("click", validate);*/
