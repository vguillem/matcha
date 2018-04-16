if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(function (pos) {
		console.log(pos)
	})
}








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
