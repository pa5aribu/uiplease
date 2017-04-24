var form = document.querySelector(".subscribe-wrapper"),
		formDetail = document.querySelector(".form-detail"),
		inputEmail = document.getElementById("mce-EMAIL");

form.onsubmit = function(e){

	if(!inputEmail.classList.contains("success")) {
		e.preventDefault();
	} else {
		formDetail.textContent = "Thanks for subscribing!";
		inputEmail.blur();
		inputEmail.className = "";
	}

}

inputEmail.addEventListener("keyup", function(e){

	if(validateEmail(this.value)){
	  this.className = "success";
	} else {
	  this.className = "error";
	}
	
});

inputEmail.addEventListener("blur", function(e){

	this.className = "";

});

function validateEmail(email) {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}