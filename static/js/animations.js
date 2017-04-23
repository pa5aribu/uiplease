// bubbles animation
var bubblesCvs = document.getElementById("bubbles"),
    bubblesCtx = bubblesCvs.getContext("2d"),
    bubblesW = bubblesCvs.width = 500,
    bubblesH = bubblesCvs.height = 300;

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

function getRandomTimesTen(min, max) {
  var random = Math.floor(Math.random() * (max - min + 1)) + min;
  return random * 10;
};

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
};

var requestInterval = function (fn, delay) {
  var requestAnimFrame = (function () {
    return window.requestAnimationFrame || function (callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
  })(),
  start = new Date().getTime(),
  handle = {};
  function loop() {
    handle.value = requestAnimFrame(loop);
    var current = new Date().getTime(),
    delta = current - start;
    if (delta >= delay) {
      fn.call();
      start = new Date().getTime();
    }
  }
  handle.value = requestAnimFrame(loop);
  return handle;
};

var stage = new createjs.Stage("bubbles");

// gradient
var grad = bubblesCtx.createLinearGradient(0, bubblesH/2, bubblesW, bubblesH/2);
grad.addColorStop(0, "#426EC2");
grad.addColorStop(1, "#3ECF8E");

TweenMax.ticker.addEventListener("tick", stage.update, stage);

function Bubble(x, radius2, duration){
  this.x = x;
  this.radius = 0;
  this.radius2 = radius2;
  this.y = bubblesH;

  this.duration = duration;

  this.bubble = new createjs.Shape();
  var bubble = this.bubble;

  this.bubble.graphics.setStrokeStyle(2).beginStroke(grad);
  var bubbleCommand = this.bubble.graphics.drawCircle(this.x, this.y, this.radius).command;

  this.bubbleCtr = new createjs.Container().addChild(this.bubble);

  stage.addChild(this.bubble, this.bubbleCtr);

  var tlBubble = new TimelineMax({});

  tlBubble.to(this, this.duration, {
    x: getRandomInt(getRandomTimesTen(15, 35)),
    y: this.radius2,
    radius: this.radius2,
    onUpdateParams: ["{self}", bubbleCommand],
    onUpdate: animate,
    onComplete: function(){
      // stage.removeChild(bubble);
    }
  }).to(this.bubbleCtr, .3, {
    alpha: 0
  }, 2)
}

requestInterval(function(){

  var xRandom = getRandomTimesTen(0, bubblesW/10);
  var radius2Random = getRandomTimesTen(2, 6);

  var bb = new Bubble(xRandom, radius2Random, 3);

}, getRandomTimesTen(40, 60));

function animate(el, bubbleCommand){
  var prop = el.target;
  bubbleCommand.x = prop.x;
  bubbleCommand.y = prop.y;
  bubbleCommand.radius = prop.radius;
}