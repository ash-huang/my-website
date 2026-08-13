new p5((p) => {
  let r;
  let d; //incremental step (+1 or -1)
  var xOffset = 100; // Perlin x-offset
  var yOffset = 100; // Perlin y-offset
  var offsetInc = 0.006; // Perlin offset increment
  var inc = 100; // Perlin increment
  var ps = 200; // Start size of perlin ring
  //var m = 1.005; // Size multiplier
  let angle = 0;

  let s = 0;
  let glass = [];
  let sball = [];

p.setup = () => {
	let canvasWidth = Math.min(550, p.windowWidth - 40);
	let canvas = p.createCanvas(canvasWidth, canvasWidth)
	canvas.parent("tick-boom-holder");
	p.textFont('Bahnschrift');
	s = p.second();
	r = 0;
	d = 1;
  }

p.draw = () => {
	p.background("rgb(100,74,131)");
		
	let cx = p.width * 0.5;
	let cy = p.height * 0.5;

	p.fill(230);
	p.circle(cx, cy, p.width * 1.2);
	
	let hang = p.map(p.hour(), 0, 12, 0, p.TWO_PI) - p.HALF_PI;
	let mang = p.map(p.minute(), 0, 60, 0, p.TWO_PI) - p.HALF_PI;
	let sang = p.map(p.second(), 0, 60, 0, p.TWO_PI) - p.HALF_PI;

  //Clock hands
	//Hours
	p.stroke(255);
	p.strokeWeight(20);
	p.line(cx, cy, cx + 100 * p.cos(hang), cy + 100 * p.sin(hang));
	//minutes
	p.stroke(255,150);
	p.strokeWeight(8);
	p.line(cx, cy, cx + p.width * 0.6 * p.cos(mang), cx + p.width * 0.6 * p.sin(mang));

  //Time in numbers
	//hours
	p.noStroke();
	p.textAlign(p.CENTER);
	p.textSize(150);
	p.fill("rgb(182,171,182)");
	p.textStyle(p.BOLD);
	let th = p.nf(p.hour(), 2);
	p.text(th,cx + p.width * 0.3 * p.cos(hang), cy + p.width * 0.3 * p.sin(hang));
	//minutes
	p.textSize(60);
	p.textStyle(p.NORMAL);
	p.noFill();
	p.stroke("rgb(100,74,131)");
	p.strokeWeight(1.5);
	let tm = p.nf(p.minute(), 2);
	p.text(tm,cx + p.width * 0.4 * p.cos(mang), cx + p.width * 0.4 * p.sin(mang)); 

  //Clock hands-Seconds
	p.stroke("rgb(154,134,154)");
	p.strokeWeight(5);
	p.line(cx, cy, cx + p.width * 0.6 * p.cos(sang), cy + p.width * 0.6 * p.sin(sang));
	p.fill(230);
	p.circle(cx + p.width * 0.2 * p.cos(sang), cy + p.width * 0.2 * p.sin(sang), 50);
	
	/* 移動的球球*/
	p.fill(0, 120, 120);
	p.noStroke();
	let x = p.random(
	  cx + p.width * 0.2 * p.cos(sang) * 0.8,
	  cx + p.width * 0.2 * p.cos(sang) * 1.2
	);
	let y = p.random(
	  cy + p.width * 0.2 * p.sin(sang) * 0.8,
	  cy + p.width * 0.2 * p.sin(sang) * 1.2
	);
	let dot = p.random(5, 30);
	p.circle(x, y, dot);
	p.fill(230);

	/*Explosion every 5 seconds*/
	if (p.second() % 5 === 0) {
	  p.noFill();
	  p.stroke(p.random(0,255),p.random(0,255),p.random(0,255));
	  p.strokeWeight(0.5);
	  p.translate(cx + p.width * 0.2 * p.cos(sang), cy + p.width * 0.2 * p.sin(sang));
	  // Create a series of perlin rings from big to small
	  for (var nTimes = 0; nTimes < 10; nTimes++) {
		// Less points for smaller rings
		nPoints = p.int(2 * p.PI * ps);
		nPoints = p.min(nPoints, 500);
		// Create ring
		p.beginShape();
		for (var i = 0; i < nPoints; i++) {
		  var a = (i / nPoints) * p.TAU;
		  var v = p5.Vector.fromAngle((i / nPoints) * p.TAU);
		  var n = p.noise(xOffset + v.x * inc, yOffset + v.y * inc) * ps;
		  v.mult(n);
		  p.vertex(v.x, v.y);
		}
		p.endShape(p.CLOSE);
		// Increment perlin offset for next ring
		xOffset += offsetInc;
		yOffset += offsetInc;
	  }
	}


	p.strokeWeight(10);
	angle += p.PI/2;
  }


  for (let i = 0; i < glass.length; i++) {
  	glass[i].show();
  }

  //drops sand every second 
  for (let i = 0; i < s; i++) {
  	sball[i].show();
  	sball[i].move();
  	if (s >= 59) {
  		sball[i].y = 100;
  		sball[i].x = 150;
  	}
  }

})