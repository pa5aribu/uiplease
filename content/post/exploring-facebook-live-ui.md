+++
title = "Exploring Facebook Live UI"
date = "2017-04-10T05:30:31+07:00"
description = "Creative approach of facebook live UI interaction"
thumbnail = "facebook-live-thumb.png"
poster = "facebook-live-poster.png"
github = "https://github.com/balapa/Facebook-Live-UI"

+++

On this very first post, I want to explore the Facebook Live UI. Facebook Live is a basic feature that offers live-streaming video capabilities to users. Watchers can also add reaction to the video.

I'm using GreenSock TweenMax to control the animation timeline. If you're not familiar with TweenMax, you can learn here https://greensock.com/learning.

#### Preload Animation

So, before we can actually interact with the emoji buttons, we need to load the video first. Upon loading, I transformed the video form to be look this the image below. It will be animated to its prior form when the class active is added.

![Example image](/images/articles/exploring-facebook-live-ui/1.png)

	.image-wrapper {
		/* transform layer's form */
		transform: matrix3d(0.226577, 0, -0.105655, 0, 0.0747091, 0.176777, 0.160214, 0, 0.298836, -0.707107, 0.640856, 0, 0, 0, 0, 1);
	}

	/* return transformed layer to original form */
	.image-wrapper.active {
		transition: .6s transform ease-in-out;
		transform: none;
	}

#### Emoji Animation Flow

Now we can assume that our video is loaded, it's time to reveal the emojis. We will need a few steps to do this. Keep in mind, this animation is running by TweenMax.

1. Show the background that contains the emojis as circle.
2. Morph the background's from circle to a form that holds all emojis. By simply changing the width valueu from <mark>80px</mark> to <mark>100%</mark>.
3. Then we show each emoji one by one using the <mark>staggerFrom</mark> method from TweenMax.

![Example image](/images/articles/exploring-facebook-live-ui/2.png)

	// preload animation timeline
	var preloadTL = new TimelineMax({
		onComplete: function(){
			// autoclick the first emoji after animation is done
			emoji.click()
		}
	});

	preloadTL

		.from(imageWrapper, .6, {
			opacity: 0,
			onComplete: function(){
				// adding class active will animate the image wrapper to its original position
				this.target.classList.add("active")
			}
		})

		// scale up background
		.from(".background", .9, {
			onStart: function(){
				// reveal live mark
				live.classList.add("active")
			},
			delay: .6,
			scale: 0,
			ease: Elastic.easeOut.config(1, 0.65)
		})

		// scretch the background with to 100%
		.to(".background", .3, {
			delay: -.35,
			width: "100%"
		})


		// animate emoji sequentially
		.staggerFrom(".emoji", .6, {
			scale: 0,
			ease: Elastic.easeOut.config(1, 0.65),
			onComplete: function(){
				// adding transition so emoji can animate when hovered
				this.target.style = "transition: .15s all ease;";
			}
		}, .1)

#### Pop In Effect

The pop in effect has 10 lines/bar. The <mark>bar-wrapper</mark> is rotated 36deg, the next element has doubled value. This will form the asterisk symbol.
To animate the <mark>bar</mark>, we simply transform its scaleY property from <mark>1</mark> to <mark>0</mark>.

![Example image](/images/articles/exploring-facebook-live-ui/3.png)

Pop in effect markup code

	<!-- HTML component -->
	<div id="effect"></div>
		<div class="bar-wrapper">
			<div class="bar"></div>
		</div>
		<!-- 9 more lines of above code -->
	</div>

Pop in effect style

	/*effect*/
	.emoji-reaction #effect {
		position: absolute;
		top: -80%;
		left: -80%;
		right: -80%;
		bottom: -80%;
	}

	/*bar wrappepr*/
	.bar-wrapper {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		margin-left: calc(3px/2 * -1);
		width: 3px;
		transform-origin: center;
	}

	/*bar*/
	.bar {
		background: #FFDA6A;
		position: absolute;
		top: 0;
		height: 35%;
		left: 0;
		right: 0;
		transform-origin: bottom;
		transform: scaleY(0);
	}

	#effect.blue .bar {
		background: #558DFF;
	}

	#effect.red .bar {
		background: #F55065;
	}

	/*reverse bar's transform origin*/
	#effect.reverse .bar {
		transform-origin: top;
	}

	/*force even child to have background white*/
	.bar-wrapper:nth-child(even) .bar {
		background: #fff !important;
	}

	/*adding rotation 36deg child after child*/
	/*this creates the asterisk effect*/

	.bar-wrapper:nth-child(2) {
		transform: rotate(36deg);
	}

#### Wave Animation

After the pop in effect is done, then we animate the popped emoji (inside the effect) to the left with waving effect. We can achieve this by using requestAnimationFrame by gradually decreasing the translateX value. As for the waving effect, 
we can simulate it using the <mark>Math.sin</mark> method.

Wave animation function

	function waveAnim(user, animProps){

		// animation ID, we can use this data to cancel animation once it pass 600px
		var animID;

		animProps.x += animProps.xSpeed;
		animProps.y += animProps.ySpeed * 0.01;

		// using the math sin, we can simulate the wave animation by changing the value
		// from 0 to 1 to -1 to 0
		y = Math.sin(animProps.y) * 25;

		// request animation
		animID = requestAnimationFrame(function(){
			waveAnim(user, animProps);
		});

		if(animProps.x < 600) {

			user.style.transform = "translate(-" + animProps.x + "px, " + y + "px)";

		} else {

			// scale down and hide the user
			if(animProps.scale > 0){
				animProps.scale -= 0.05;
				animProps.opacity -= 0.05;
				user.style.transform = "translate(-" + animProps.x + "px, " + y + "px) scale(" + animProps.scale + ")";
				user.style.opacity = animProps.opacity;
			} else {

				// remove reaction wrapper from DOM
				user.parentElement.parentElement.removeChild(user.parentElement);
				// stop wave animation
				cancelAnimationFrame(animID);

			}
			
		}
		
	}

#### Conclusion

I hope you find this exploration inspiring! If you want to play with the code yourself, feel free to check it out it on <a href="https://github.com/balapa/Facebook-Live-UI">github</a>.