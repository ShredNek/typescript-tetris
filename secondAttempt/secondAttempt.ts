class Tetris {
	constructor(imageX: number, imageY: number, template: Array<any>) {
		this.imageY = imageY;
		this.imageX = imageX;
		this.template = template;
	}

	checkBottom() {
		
	}
	checkLeft() {

	}
	checkRight() {

	}

	moveRight() {
		
	}
	moveLeft() {

	}
	moveBottom() {

	}
	chanegRotation() {

	}
}	

const imageSquareSize = 24
const size = 48
const framePerSecond = 24
const gameSpeed = 5 
const canvas: any = document.getElementById("canvas")
const image = document.getElementById("image")
const ctx = canvas.getContext("2d");
const sqaureCountX = canvas.width / size;
const sqaureCountY = canvas.height / size;

const shapes = [
	new Tetris(0,120, [
		[0,1,0],
		[0,1,0],
		[1,1,0],
	]),
	new Tetris(0,96, [
		[0,0,0],
		[1,1,1],
		[0,1,0],
	]),
	new Tetris(0,72, [
		[0,1,0],
		[0,1,0],
		[0,1,1],
	]),
	new Tetris(0,48, [
		[0,0,0],
		[0,1,1],
		[1,1,0],
	]),
	new Tetris(0,48, [
		[0,0,0],
		[1,1,0],
		[0,1,1],
	]),
	new Tetris(0,24, [
		[0,0,1,0],
		[0,0,1,0],
		[0,0,1,0],
		[0,0,1,0],
	]),
	new Tetris(0,0, [
		[1,1],
		[1,1],
	])
]

let gameMap;
let gameOver: boolean;
let currentShape;
let score;
let whiteLineThickness = 4;

let gameLoop = () => {
	setInterval(update, 1000/ gameSpeed);
	setInterval(draw, 1000/ framePerSecond);
};

let update = ()  => {}

let drawRect = (x: number,y: number,w: number,h: number,c: string) => {
	ctx.fillStyle = c;
	ctx.fillRect(x,y,w,h);
}

let drawBackground = () => {
	drawRect(0,0, canvas.width, canvas.height, "#bca0dc");
	for(let i = 0; i< sqaureCountX + 1; i++) {
		drawRect(
			size * i - whiteLineThickness, 
			0, 
			whiteLineThickness, 
			canvas.height, 
			"white")
	}
}

let draw = () => {
	ctx.clearRect(0,0, canvas?.width, canvas?.height);
	drawBackground();
	drawSqaures();
	drawCurrentTetris();
	drawNextShape();
	 if (gameOver) {
		drawGameOver();
	 }
}

let getRandomShape = () => {
	return Object.create(shapes[Math.floor(Math.random() * shapes.length)])
}

let resetVars = () => {
	let initialTwoDArr = [];
	for( let i = 0; i< sqaureCountY; i++) {
		let temp = [];
		for (let j=0; j< sqaureCountX; j++ ) {
			temp.push({imageX:-1, imageY: -1});
		}
		initialTwoDArr.push(temp)
	}
	score = 0;
	gameOver = false;
	currentShape = getRandomShape();
	gameMap = initialTwoDArr
}

gameLoop()