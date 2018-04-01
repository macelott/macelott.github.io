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

var particles, cnv, s, count, sugarDisplay;


$(document).ready(function() {
  sugarDisplay = document.getElementById('sugarCount');
});

function setup() {
  cnv = createCanvas(windowWidth, windowHeight - 80);
  //cnv.mousePressed(createParticle);
  particles = [];
  count = 0;
}

function draw() {
  background(51);
  background(0);

  s = 'Sugar (mg): ' + count.toString();
  sugarDisplay.innerHTML = s;

  if (mouseIsPressed) {
    createParticle();
  }

  for (i = 0; i < particles.length; i++) {
    particles[i].run();
  }

  if (particles.length==0) {
    fill(255);
    textAlign(CENTER);
    textSize(32);
    text("click mouse to add particles", width/2, height/2);
  }
}

function createParticle() {
  p = new Particle(createVector(mouseX, mouseY));
  particles.push(p);
  count += 5;
}

// A simple Particle class
var Particle = function(position) {
  this.acceleration = createVector(0, 0.5);
  this.velocity = createVector(random(-1, 1), 0);
  this.position = position.copy();
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
};

// Method to display
Particle.prototype.display = function () {
  stroke(200, this.lifespan);
  strokeWeight(2);
  fill(127, this.lifespan);
  rect(this.position.x, this.position.y, 1, 1);
};
