+++

date = "2017-04-10T05:30:31+07:00"
title = "Exploring Facebook Live UI"
Description = "Creative approach of facebook live UI interaction"
thumbnail = "facebook-live-thumb.png"

+++

On this very first tutorial, I want to explore Facebook Live UI. Facebook Live is a basic feature that offers live-streaming video capabilities to users. Watchers can also use emoji to the video. 

I'm using GreenSock TweenMax to control the animation flow. If you're not familiar with TweenMax, you can learn here https://greensock.com/learning/

#### Preload Animation

So, before we can actually interact with the emoji buttons, we need to load the video first. We transform the video's form using CSS to be like this.

![Example image](/images/articles/exploring-facebook-live-ui/1.png)

The animation will be triggered by adding class active. This will remove the element's transform value and animate the image wrapper to its original form. We can achieve by simply using <mark>transform: none;</mark>

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

Now we can assume that our video is fully loaded, we then reveal the emojis. We will need a few steps to do this. Keep in mind, this animation is running by TweenMax.

1. Show the background that contains the emojis as circle
2. Then it morphs its width so it will 100% full. Simply changing the width from <mark>80px</mark> to <mark>100%</mark>
3. Then we show each emoji one by one using <mark>scale</mark> property

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

The effect contains 10 lines of a bar. The <mark>bar-wrapper</mark> is rotated 36deg based on its index. This will form the asterisk symbol.
To animate the <mark>bar</mark>, we simply transform its scaleY property from <mark>1</mark> to <mark>0</mark>.

![Example image](/images/articles/exploring-facebook-live-ui/3.png)

Here's the HTML code

	<!-- HTML component -->
	<div id="effect"></div>
		<div class="bar-wrapper">
			<div class="bar"></div>
		</div>
		<!-- 9 more lines of above code -->
	</div>

Effect Styling

	/*effect*/
	.emoji-reaction #effect {
		position: absolute;
		top: var(--effect-position);
		left: var(--effect-position);
		right: var(--effect-position);
		bottom: var(--effect-position);
	}

	/*bar wrappepr*/
	.bar-wrapper {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 50%;
		margin-left: calc(var(--bar-size)/2 * -1);
		width: var(--bar-size);
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

Here's the JavaScript animation flow

	// animation flow
	.to(bar, .3, {
		scaleY: 1,
		onComplete: function(){
			// reverse the effect transform origin - from bottom to top
			// now animation will goes from bottom to top
			effect.classList.add("reverse");
		}
	})

	.to(bar, .3, {
		scaleY: 0
	})

#### Final touch: Wave Animation

After the pop in effect, we can to translate the popped emoji to the left with waving effect. We can achieve this using requestAnimationFrame by gradually decreasing the translateX value. As for the waving effect, 
we can simulate it using the <mark>Math.sin</mark> method.

Here's the wave animation code

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

I hope you find this approach inspiring! I will do more of these experiments later. Stay tuned!