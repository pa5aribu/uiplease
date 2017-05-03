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

function validateEmail(email) {
  var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(email);
}

// home animation
var cards = get.allArray(".card");
var activeCard = cards[0];
cards.shift();

var tl = new TimelineMax({
	delay: .3,
	// onComplete: function(){
	// 	console.log(cards)
	// }
});

// tl.timeScale(0.5)

animateCards(activeCard, cards);

function animateCards(activeCard, nextCards){

	tl

		.to(activeCard, .3, {
			x: "+=30",
			y: "+=30",
			opacity: 0,
			onComplete: function(){
				this.target.style.zIndex = -4;
			}
		})

		.staggerTo(nextCards, .3, {
			x: "+=20",
			y: "+=20",
			onComplete: function(){
				// console.log(this.target)

				// this.target.style.zIndex = this.target.style.zIndex + 1;

				// nextCards.forEach(function(card){
				// 	card.style.zIndex = parseInt(card.style.zIndex) + 1;
				// })
			}
		}, .15)

		.set(nextCards, {
			zIndex: "+=1"
		})

		.set(activeCard, {
			delay: -.3,
			x: -80,
			y: -80
		})

		.to(activeCard, .3, {
			x: "+=20",
			y: "+=20",
			opacity: 1,
			onComplete: function(){
				cards.push(activeCard);

				var newActiveCard = cards[0];
				cards.shift();

				setTimeout(function(){
					animateCards(newActiveCard, cards);
				}, 300);

			}
		})

}