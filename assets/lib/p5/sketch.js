/*
//the relative boxSize variable
var boxSize = 100;

function setup() {
  rectMode(CENTER)
  var cnv = createCanvas(windowWidth, windowHeight - 73, WEBGL);
  cnv.style('display', 'block');
  background(255, 200, 200);
}

function windowReboxSized() {
  reboxSizeCanvas(windowWidth, windowHeight - 73);
  background(255, 200, 200);
}

function draw() {
  background(255, 200, 200);

  //limit size of cube
  if (boxSize <= 0) {
    boxSize = 1;
  }

  if (boxSize >= 150) {
    boxSize = 150;
  }

  //rect(windowWidth/2, windowHeight/2.5, boxSize, boxSize);
  rotateX(-0.3);
  rotateY(-0.3);
  box(boxSize);
}

function mouseWheel(event) {
  boxSize += event.delta/1.5;
  return false;
}
*/

var particles, cnv, s, count, sugarDisplay, shapeHeight;

$(document).ready(function() {
  sugarDisplay = document.getElementById('sugarCount');
});

function setup() {
  cnv = createCanvas(windowWidth/2.5, windowHeight - 80);
  img = loadImage("assets/common/images/bowl2.png");
  img2 = loadImage("assets/common/images/bowl_with_gray2.png");
  particles = [];
  count = 0;
  shapeHeight = 0;
}
/*
function windowResized() {
  resizeCanvas(windowWidth/3, windowHeight);
}
*/
function draw() {
  background('#969696');

  if (count <= 112000) {
    s = 'Sugar (mg): ' + count.toString();
    sugarDisplay.innerHTML = s;
  }

  if (mouseIsPressed) {
    createParticle();
    createParticle();
  }

  fill(255);
  stroke(0);
  strokeWeight(0);
  rectMode(CENTER);
  imageMode(CENTER);

  if (shapeHeight <= (height * 1.12)) {
    rect(windowWidth/5, windowHeight - 80, windowWidth/2.9, shapeHeight);
  } else {
    rect(windowWidth/5, windowHeight - 80, windowWidth/2.8, height * 1.12);
  }

  image(img2, windowWidth/5, (windowHeight - 80)/1.34, width, (height/1.5));

  for (i = 0; i < particles.length; i++) {
    particles[i].run();
  }

  image(img, windowWidth/5, (windowHeight - 80)/1.38, width, (height/1.5));

  noFill();
  stroke(0);
  strokeWeight(40);


  if (particles.length==0) {
    fill(255);
    textAlign(CENTER);
    textSize(32);
    strokeWeight(0);
    text("click and hold to add sugar", width/2, height/4);
  }
}

function createParticle() {
  p = new Particle(createVector(mouseX, mouseY));
  particles.push(p);
  count += 100;
  shapeHeight += height * 1.12 * 0.0009;
}

// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0.5);
  this.velocity = createVector(random(-1, 1), 0);
  this.position = position.copy();
  this.lifespan = 300;
};

Particle.prototype.run = function() {
  this.update();
  this.display();
};

// Method to update position
Particle.prototype.update = function(){
  if (this.position.y >= (windowHeight - 80)) {
    this.velocity = 0;
    this.acceleration = 0;
    this.position.y = windowHeight - 80;
  } else {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
  }

  this.lifespan -= 2;

  if (this.isDead()) {
    particles.splice(i, 1);
  }
};

// Method to display
Particle.prototype.display = function () {
  stroke(200, this.lifespan);
  strokeWeight(2);
  fill(127, this.lifespan);
  rect(this.position.x, this.position.y, 1, 1);
};

// Is the particle still useful?
Particle.prototype.isDead = function () {
  if (this.lifespan < 0) {
    return true;
  } else {
    return false;
  }
};
