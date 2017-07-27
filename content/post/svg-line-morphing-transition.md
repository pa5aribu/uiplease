+++
date = "2017-04-27T10:14:48+07:00"
title = "SVG Line Morphing Transition"
categories = ["experiment", "carousel"]
description = "Interactive SVG line as button's indicator"
thumbnail = "svg-line-animation-on-buttons-thumb.png"
poster = "svg-line-animation-on-buttons-poster.png"
github = "https://github.com/balapa/SVG-Line-Morphing-Transition"

+++

In this tutorial we're gonna be looking at how SVG line animation can be used as button's indicator. The idea is to morph circular SVG line into straight line and morphs back into circle SVG. We will incorporate this effect into image carousel.

#### The basic concept

So, we will need 2 elements to make this effect works. First is the circular line and the second is the straight line.

Here's the markup

	<div class="controls">

			<!-- circle line -->
			<div id="circle-line">
				<svg width="38px" height="38px" viewBox="0 0 38 38" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
				  <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
				    <circle id="circle-line-path" stroke-width="4" cx="19" cy="19" r="17"></circle>
					</g>
				</svg>
			</div>

			<!-- straight line -->
			<div class="straight-line"></div>

			<div class="dot active"></div>
			<div class="dot"></div>
			<div class="dot"></div>
			<div class="dot"></div>
			<div class="dot"></div>
			<div class="dot"></div>
		</div>
	</div>

Here's the styling for circular line and straight line

	#circular-line {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
		transform: rotate(90deg);
	}

	#circular-line.flip {
		transform: rotate(90deg) scaleY(-1);
	}

	#circular-line-path {
		stroke-dasharray: 106;
		stroke-dashoffset: 0;
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke: #F6A4EB;
	}

	.straight-line {
		position: absolute;
		left: 0;
		right: 0;
		width: 100%;
		bottom: 0;
		height: 4px;
		background: #F6A4EB;
		border-radius: 3px;
		transform-origin: left;
		transform: scaleX(0);
	}

Here's the circular line and straight line. We use SVG for the circular line and DOM for the straight line.
![image](/images/articles/svg-line-animation-on-buttons/1.png)

#### Let's Animate!

To animate the circular line, we need to change the <mark>stroke-dashoffset</mark> property on <mark class="code">circle</mark> element from <mark>0</mark> to <mark>105</mark>. And for the straight line, we simply change its <mark>transform scaleX</mark> value from <mark>0</mark> to <mark>1</mark>.

We use GreenSock TweenMax to animate these lines.

	// define animation timeline
	var tl = new TimelineMax({});

	tl

		.to(circularLinePath, staticAnimProps.duration, {

			css: {
				// animation css stroke-dashoffset property
				// this will yield the circular loading effect
				"stroke-dashoffset": 105
			}

		})

		.to(straightLine, staticAnimProps.duration/2, {

			// animates the length of the line
			scaleX: 1,

			onComplete: function(){

				// straight line animation direction changes to the opposite
				this.target.style.transformOrigin = dynamicAnimProps.direction;

				// move circular line position to the clicked dot position
				circularLine.style.left = dynamicAnimProps.circularLinePos + "px";

			}

		}, 0.15)

		.to(straightLine, staticAnimProps.duration, {

			// animate the straight line length to zero
			scaleX: 0

		})

		.to(circularLinePath, staticAnimProps.duration, {

			onStart: function(){

				// if the animation direction goes to left, flip the circular line
				(dynamicAnimProps.flipcircular) ? circularLine.className = "" : circularLine.className = "flip";

			},

			delay: -staticAnimProps.duration,
			css: {
				// animate circular line to 0
				"stroke-dashoffset": 0
			}

		})

#### Timing the animation correctly

Here's is animation timeline.

![image](/images/articles/svg-line-animation-on-buttons/2.png)

So, the first circular animation starts from the right side. After the staright line animation is done, we move the circle line position to the clicked dot's position and we the circle line using by adding class <mark>flip</mark>. That'll flip its parent element. And now the animation will start from the left.

	#circular-line.flip {
		transform: rotate(90deg) scaleY(-1);
	}

#### Animation direction

So there are 2 cases when animating these lines. If we click the dot on the right side of the active dot, the animation goes to right direction and vice versa. Here's the math to calculate the straight line's width, position, and transform-origin.
	
	// define animation direction
	// if the selected dot has bigger index, then it's animation direction goes to the right
	if(getIndex(this, thisArray) > getIndex(activeDot, thisArray)){

		dynamicAnimProps.direction = "right";

		// get the width between the active dot and the clicked dot
		dynamicAnimProps.straightLine.width = dynamicAnimProps.newLinePos - dynamicAnimProps.oldLinePos + 2.5;
		dynamicAnimProps.straightLine.pos = dynamicAnimProps.oldLinePos + 5;
		dynamicAnimProps.flipcircular = false;
		dynamicAnimProps.straightLine.origin = "left";
		dynamicAnimProps.translateVal = staticAnimProps.translateVal;

	} else {

		dynamicAnimProps.direction = "left";

		dynamicAnimProps.straightLine.width = -(dynamicAnimProps.newLinePos - dynamicAnimProps.oldLinePos - 2.5);
		dynamicAnimProps.straightLine.pos = dynamicAnimProps.newLinePos + 5;
		dynamicAnimProps.flipcircular = true;
		dynamicAnimProps.straightLine.origin = "right";
		dynamicAnimProps.translateVal = -staticAnimProps.translateVal;

	}

#### Final words

I hope you liked this experiment! Go to <a href="">GitHub</a> page to read and understand the whole mechanism of this interaction.