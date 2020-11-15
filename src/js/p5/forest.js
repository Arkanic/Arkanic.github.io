let c=0;
let s=17;
let mx, my, mxt, myt;
function setup() {
    let cnv = createCanvas(windowWidth,windowHeight);
    cnv.style("display", "block");
    cnv.parent("main");
	mxt = random(1, windowWidth);
	myt = random(1, windowHeight)
}
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
function draw() {
    background(255);
	textSize(s)
	c += 2e-4//2e-4;
	mxt+=1;
	myt+=1;
	mx = mxt*1e-3//mouseX*1e-3;
	my = myt*1e-3//mouseY*1e-3;  
	for(i=0;i<width/s;i++) {
		for(j=0;j<height/s;j++) {
			let n = int(noise(i*.002-mx,j*.002-my,c)*7000)+7000
			text(String.fromCharCode(n),i*s,j*s)
		}
	}
}