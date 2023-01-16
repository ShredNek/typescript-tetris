class Tetris {
  imageX: number;
  imageY: number;
  template: Array<Array<number>>;
  x: number;
  y: number;

  constructor(imageX: number, imageY: number, template: Array<Array<number>>) {
    this.imageX = imageX;
    this.imageY = imageY;
    this.template = template;
    this.x = squareCountX / 2.5;
    this.y = -1;
  }
  getTruncedPosition() {
    return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
  }

  checkBottom() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] === 0) continue;
        let realX: number = i + this.getTruncedPosition().x;
        let realY: number = j + this.getTruncedPosition().y;
        console.log(
          realX,
          realY,
          squareCountY,
          i,
          j,
          Math.trunc(squareCountY) - 1
        );
        if (realY + 1 >= squareCountY) return false;
        if (gameMap[realY + 1][realX].imageX !== -1) return false;
      }
    }
    return true;
  }

  checkLeft() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX - 1 < 0) return false;
        if (gameMap[realY][realX - 1].imageX !== -1) return false;
      }
    }
    return true;
  }

  checkRight() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX + 1 >= squareCountX) return false;
        if (gameMap[realY][realX + 1].imageX !== -1) return false;
      }
    }
    return true;
  }

  moveBottom() {
    if (this.checkBottom()) {
      this.y += 1;
    }
  }

  moveRight() {
    if (this.checkRight()) {
      this.x += 1;
    }
  }

  moveLeft() {
    if (this.checkLeft()) {
      this.x -= 1;
    }
  }

  changeRotation() {
    let solution: number[][] = [];
    this.template[0].forEach((n) => solution.push([n]));
    for (let i = 1; i < this.template.length; i++) {
      for (let j = 0; j < solution.length; j++) {
        solution[j].unshift(this.template[i][j]);
      }
    }
    this.template = solution;
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (
          realX < 0 ||
          realX >= squareCountX ||
          realY < 0 ||
          realY <= squareCountY
        ) {
          return false;
        }
      }
    }
    return true;
  }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const nextShapeCanvas = document.getElementById(
  "nextShapeCanvas"
) as HTMLCanvasElement;
const scoreCanvas = document.getElementById("scoreCanvas") as HTMLCanvasElement;
const image = document.getElementById("image") as HTMLImageElement;
const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
const nctx = nextShapeCanvas.getContext("2d") as CanvasRenderingContext2D;
const sctx = scoreCanvas.getContext("2d") as CanvasRenderingContext2D;

const imageSquareSize = 24;
const size = 48;
const framePerSecond = 24;
const gameSpeed = 2;
const squareCountX: number = canvas.width / size;
const squareCountY: number = canvas.height / size;

const shapes = [
  new Tetris(0, 120, [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ]),
  new Tetris(0, 96, [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]),
  new Tetris(0, 72, [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ]),
  new Tetris(0, 48, [
    [0, 0, 0],
    [0, 1, 1],
    [1, 1, 0],
  ]),
  new Tetris(0, 48, [
    [0, 0, 0],
    [1, 1, 0],
    [0, 1, 1],
  ]),
  new Tetris(0, 24, [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
  ]),
  new Tetris(0, 0, [
    [0, 0, 0],
    [1, 1, 0],
    [1, 1, 0],
  ]),
];

let gameMap: Array<Object[]>;
let gameOver: boolean;
let currentShape: Tetris;
let nextShape: Tetris;
let score: number = 0;
let whiteLineThickness = 4;

let gameLoop = () => {
  setInterval(update, 1000 / gameSpeed);
  setInterval(draw, 1000 / framePerSecond);
};

let deleteCompletedRow = () => {
  for (let i = 0; i < gameMap.length; i++) {
    let t = gameMap[i];
    let isComplete = true;
    for (let j = 0; j < t.length; j++) {
      if (t[j].imageX === -1) isComplete = false;
    }
    if (isComplete) {
      score += 10;
      for (let k = i; k > 0; k--) {
        gameMap[k] = gameMap[k - 1];
      }
      let temp = [];
      for (let j = 0; j < squareCountX; j++) {
        temp.push({ imageX: -1, imageY: -1 });
      }
      gameMap[0] = temp;
    }
  }
};

let update = () => {
  console.log(currentShape.checkBottom());
  if (gameOver) return;
  if (currentShape.checkBottom()) {
    currentShape.y += 1;
  } else {
    for (let k = 0; k < currentShape.template.length; k++) {
      for (let l = 0; l < currentShape.template.length; l++) {
        if (currentShape.template[k][l] == 0) continue;
        gameMap[currentShape.getTruncedPosition().y + l][
          currentShape.getTruncedPosition().x + k
        ] = {
          imageX: currentShape.imageX,
          imageY: currentShape.imageY,
        };
      }
    }

    deleteCompletedRow();
    currentShape = nextShape;
    nextShape = getRandomShape();
    if (!currentShape.checkBottom()) {
      gameOver = true;
    }
  }
};

let drawRect = (x: number, y: number, w: number, h: number, c: string) => {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
};

let drawBackground = () => {
  drawRect(0, 0, canvas.width, canvas.height, "#bca0dc");

  for (let i = 0; i < squareCountX + 1; i++) {
    drawRect(
      size * i - whiteLineThickness,
      0,
      whiteLineThickness,
      canvas.height,
      "white"
    );
  }

  // ? ... and then the height of the grid.
  for (let i = 0; i < squareCountY + 1; i++) {
    drawRect(
      0,
      size * i - whiteLineThickness,
      canvas.width,
      whiteLineThickness,
      "white"
    );
  }
};

let drawCurrentTetris = () => {
  for (let i = 0; i < currentShape.template.length; i++) {
    for (let j = 0; j < currentShape.template.length; j++) {
      if (currentShape.template[i][j] == 0) continue;
      ctx.drawImage(
        image,
        currentShape.imageX,
        currentShape.imageY,
        imageSquareSize,
        imageSquareSize,
        Math.trunc(currentShape.x) * size + size * i,
        Math.trunc(currentShape.y) * size + size * j,
        size,
        size
      );
    }
  }
};

let drawSqaures = () => {
  for (let i = 0; i < gameMap.length; i++) {
    let t = gameMap[i];
    for (let j = 0; j < t.length; j++) {
      if (t[j].imageX === -1) continue;
      ctx.drawImage(
        image,
        t[j].imageX,
        t[j].imageY,
        imageSquareSize,
        imageSquareSize,
        j * size,
        i * size,
        size,
        size
      );
    }
  }
};

let drawNextShape = () => {
  nctx.fillStyle = "#bca0dc";
  nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
  for (let i = 0; i < nextShape.template.length; i++) {
    for (let j = 0; j < nextShape.template.length; j++) {
      if (nextShape.template[i][j] == 0) continue;
      nctx.drawImage(
        image,
        nextShape.imageX,
        nextShape.imageY,
        imageSquareSize,
        imageSquareSize,
        size * i + 40,
        size * j + 70,
        size,
        size
      );
    }
  }
};

let drawScore = () => {
  sctx.font = "24px Verdana";
  sctx.fillStyle = "black";
  sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
  sctx.fillText("Score:", 10, 30);
  sctx.fillText(score.toString(), 10, 80);
};

let drawGameOver = () => {
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "56px Verdana";
    ctx.fillStyle = "black";
    ctx.fillText("Game Over :(", canvas.width / 12, canvas.height / 2 - 120);
    ctx.fillText(" Want to try", canvas.width / 12, canvas.height / 2 - 10);
    ctx.fillText("     again?", canvas.width / 12, canvas.height / 2 + 70);
  }
};

let draw = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();
  drawSqaures();
  drawCurrentTetris();
  drawNextShape();
  drawScore();
  if (gameOver) {
    drawGameOver();
  }
};

let getRandomShape = () => {
  return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};

let resetVars = () => {
  let initialTwoDArr = [];
  for (let i = 0; i < squareCountY; i++) {
    let temp = [];
    for (let j = 0; j < squareCountX; j++) {
      temp.push({ imageX: -1, imageY: -1 });
    }
    initialTwoDArr.push(temp);
  }
  gameOver = false;
  currentShape = getRandomShape();
  nextShape = getRandomShape();
  gameMap = initialTwoDArr;
};

window.addEventListener("keydown", (event) => {
  if (event.keyCode == 37) currentShape.moveLeft();
  else if (event.keyCode == 38) currentShape.changeRotation();
  else if (event.keyCode == 39) currentShape.moveRight();
  else if (event.keyCode == 40) currentShape.moveBottom();
});

resetVars();
gameLoop();
