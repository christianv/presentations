// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

(function() {
  var lastTime = 0;
  var vendors = ['ms', 'moz', 'webkit', 'o'];
  for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
      window[vendors[x] + 'CancelRequestAnimationFrame'];
  }

  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback, element) {
      var currTime = new Date().getTime();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime));
      var id = window.setTimeout(function() {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return id;
    };
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }
}());

// Test
(function() {

  var width, height, canvas, ctx, circles, target, animateHeader = true;

  // Main
  initHeader();
  addListeners();

  function initHeader() {


    canvas = document.getElementById('intro-canvas');
    resize();
    ctx = canvas.getContext('2d');

    // create particles
    circles = [];
    for(var x = 0; x < width*0.5; x++) {
        var c = new Circle();
        circles.push(c);
    }
    animate();

    setTimeout(resize, 1);
  }

  // Event handling
  function addListeners() {
      window.addEventListener('scroll', scrollCheck);
      window.addEventListener('resize', resize);
  }

  function scrollCheck() {
      if(document.body.scrollTop > height) animateHeader = false;
      else animateHeader = true;
  }

  function scale() {
    var denominator = Math.max(
      document.body.clientWidth / window.innerWidth,
      document.body.clientHeight / window.innerHeight
    );

    return 1 / denominator;
  };

  function resize() {
    var scaleI = scale();
      width = window.innerWidth;
      height = scaleI < 1 ? window.innerHeight * scaleI : window.innerHeight;
      canvas.width = width;
      canvas.height = height;
  }

  function animate() {
      if(animateHeader) {
          ctx.clearRect(0,0,width,height);
          for(var i in circles) {
              circles[i].draw();
          }
      }
      requestAnimationFrame(animate);
  }

  // Canvas manipulation
  function Circle() {
      var _this = this;

      // constructor
      (function() {
          _this.pos = {};
          init();
      })();

      function init() {
          _this.pos.x = Math.random()*width;
          _this.pos.y = height+Math.random()*100;
          _this.alpha = 0.1+Math.random()*0.3;
          _this.scale = 0.1+Math.random()*0.3;
          _this.velocity = Math.random();
      }

      this.draw = function() {
          if(_this.alpha <= 0) {
              init();
          }
          _this.pos.y -= _this.velocity;
          _this.alpha -= 0.0005;
          ctx.beginPath();
          ctx.arc(_this.pos.x, _this.pos.y, _this.scale*15, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'rgba(255,255,255,'+ _this.alpha+')';
          ctx.fill();
      };
  }

})();
