new p5((p) => {

let r;
let d; //incremental step (+1 or -1)

p.setup = () => {
	let canvasWidth = Math.min(550, p.windowWidth - 40);
	let canvas = p.createCanvas(canvasWidth, canvasWidth)
	canvas.parent("fireworks");
	p.background(220);
	r = 0;
	d = 1;
}

p.draw = () => {
	p.noStroke();
	r = r + d;
	if (r > 255) {
		r = 255;
		d = -1;
	}
	if (r < 0) {
		r = 0;
		d = 1;
	}
	p.fill(r, 120, 120);
	p.noStroke();
	let x =p.random(0,p.width);
	let y =p.random(0,p.height);
	let s=p.random(5,30);
	p.circle(x,y,s);
	
	p.stroke(r,12,120);
	p.strokeWeight(s*0.1);
	p.noFill();
	let mx =p.lerp(x,p.mouseX,0.3);
	let my =p.lerp(y,p.mouseY,0.3);
	p.line(x,y,mx,my)
	//console.log(r);
}

function keyPressed(){
	if(key ==='s'){
	p.saveCanvas("canvas","png");
	}
}

})