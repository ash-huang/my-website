new p5((p) => {

let n = 30;
let sx, sy;
let range = 150;

p.setup = () => {
	let canvasWidth = Math.min(550, p.windowWidth - 40);
	let canvas = p.createCanvas(canvasWidth, canvasWidth)
	canvas.parent("mouse-attractor");
	sx = p.width / n;
	sy = p.height / n;
	p.rectMode(p.CENTER);
}

p.draw = () => {
	p.background(220);
	p.noStroke();
	for (let i = 0; i < n; i++) {
	// i++ equals i=i+1
	for (let j = 0; j < n; j++) {
		let x = j * sx;
		let y = i * sy;
		let d = p.dist(x, y, p.mouseX, p.mouseY);

		let gx = 0;
		let gy = 0;
		let ga = 255;//alpha 

		if (d < range) {
		gx = p.map(d, 0, range, 1, sx);
		gy = p.map(d, 0, range, 1, sy);
		ga = p.map(d, 0, range, 0, 255);
		} else {
		gx = sx;
		gy = sy;
		ga = 255;
		}
		//stroke(0,ga);
		p.fill(255, ga);
		p.rect(x, y, gx, gy);
	}
	}
}
})