// global variables
var body = document.body,
		sections = document.querySelectorAll("section"),
		sectionThumbnails = document.querySelectorAll(".section-thumbnail"),
		segments = body.querySelectorAll(".segment");
		segmentLength = 20;

// convert nodelist to array
sections = toArray(sections);
sectionThumbnails = toArray(sectionThumbnails);

// animation default settings
var animationSettings = {
	running: false,
	easing: "easeInOutQuad",
	duration: 750,
	delay: 25,
	elasticity: 10
}

sections.forEach(function(section){
	
	// document fragment
	var fragment = document.createDocumentFragment();

	// get data-img value
	var sectionImgURL = section.dataset.img;

	// looping 20 times
	for(var i = 0; i < segmentLength; i++){

		var segment = document.createElement("div");
		segment.className = "segment";

		// calculate the segment inner background position
		var posX = -i * 100/segmentLength;

		segment.innerHTML = "<div class='segment-inner' style='background-image: url(" + sectionImgURL + "); left: " + posX + "vw'></div>";

		// apply segment width by dividing 100 by 20
		segment.style.width = 100/segmentLength + "%";

		// append segment to section element
		fragment.appendChild(segment);
		section.appendChild(fragment);

	}

});

// get shown section
var shownSection = body.querySelector(".show");

// if the key is clicked
body.addEventListener("keyup", function(e){

	// if arrow down is clicked
	if(e.keyCode === 40 && shownSection.nextElementSibling && animationSettings.running === false) {

		animationSettings.running = true;
		animateSegments(shownSection.nextElementSibling, false);

	}

	// if arrow right is clicked
	if(e.keyCode === 39 && shownSection.nextElementSibling && animationSettings.running === false) {

		animationSettings.running = true;
		animateSegments(shownSection.nextElementSibling, false);

	}

	// if arrow up is clicked
	if(e.keyCode === 38 && shownSection.previousElementSibling && animationSettings.running === false) {

		animationSettings.running = true;
		animateSegments(shownSection.previousElementSibling, false);

	}

	// if arrow left is clicked
	if(e.keyCode === 37 && shownSection.previousElementSibling && animationSettings.running === false) {

		animationSettings.running = true;
		animateSegments(shownSection.previousElementSibling, false);

	}

});

// if section thumbnail is clicked
sectionThumbnails.forEach(function(thumbnail){

	thumbnail.addEventListener("click", function(){

		if(animationSettings.running === false && !this.classList.contains("active")) {

			animationSettings.running = true;
			animateSegments(sections[sectionThumbnails.indexOf(this)], true);

		}
	})
});

// animate the section's segments
// first param is the next hidden section
// the second param defines whether the animation is requested by click event or not
function animateSegments(afterShownSection, byClickOrNot) {

	var translateYValue, // transition direction
			hiddenPosition; // hide at top or bottom

	if(afterShownSection.className === "hide-bottom") {

		translateYValue = "-100%";
		hiddenPosition = "hide-top";

	} else {

		translateYValue = "100%";
		hiddenPosition = "hide-bottom";

	}

	// get the index of after shown section
	var afterShownSectionIndex = sections.indexOf(afterShownSection);

	// shown section params
	var shownSectionParams = {
		// do function before animation starts
		begin: function(){

			// remove the active class from active thumbnails
			sectionThumbnails[sections.indexOf(shownSection)].classList.remove("active");

		},
		targets: shownSection.querySelectorAll(".segment"),
		complete: function(){

			this.animatables.forEach(function(animatable){
				animatable.target.style.transform = "translateY(0)";
			});

			// if the animate function is requested by click
			if(byClickOrNot) {

				sections.forEach(function(section, index){

					// get all previous sections from the shown
					if(index < afterShownSectionIndex) {
						section.className = "hide-top";
					}

					// get all next sections from the shown
					if(index > afterShownSectionIndex) {
						section.className = "hide-bottom";
					}

				});

			} 

			// if the animate function is requested by arrow key
			else {

				shownSection.className = hiddenPosition;

			}

		}
	}

	// after shown section params
	var afterShownParams = {
		begin: function(){

			sectionThumbnails[sections.indexOf(afterShownSection)].classList.add("active");

		},
		targets: afterShownSection.querySelectorAll(".segment"),
		complete: function(){

			this.animatables.forEach(function(animatable){
				animatable.target.style.transform = "translateY(0)";
			});

			afterShownSection.className = "show";

			shownSection = afterShownSection;

			animationSettings.running = false;

		}
	}

	// animate the shown section
	requestAnimate(shownSectionParams, translateYValue);

	// animate the hidden section
	requestAnimate(afterShownParams, translateYValue);

}

// utils

// request animate function
function requestAnimate(animationParams, translateYValue){

	anime({
		begin: animationParams.begin,
		targets: animationParams.targets,
		translateY: translateYValue,
		duration: animationSettings.duration,
		delay: function(el, index) {
			return index * animationSettings.delay;
		},
		elasticity: animationSettings.elasticity,
		complete: animationParams.complete
	});

}

// convert nodelist to array
function toArray(nodeList){
	nodeList = [].slice.call(nodeList);
	return nodeList;
}