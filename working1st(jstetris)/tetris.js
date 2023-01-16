class Tetris {
  constructor(imageX, imageY, template) {
    this.imageY = imageY;
    this.imageX = imageX;
    this.template = template;
    this.x = sqaureCountX / 2.5;
    this.y = -1;
  }

  checkBottom() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realY + 1 >= sqaureCountY) return false;
        if (gameMap[realY + 1][realX].imageX != -1) return false;
      }
    }
    return true;
  }

  getTruncedPosition() {
    return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
  }

  checkLeft() {
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        if (this.template[i][j] == 0) continue;
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        if (realX - 1 < 0) return false;
        if (gameMap[realY][realX - 1].imageX != -1) return false;
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
        if (realX + 1 >= sqaureCountX) return false;
        if (gameMap[realY][realX - 1].imageX != -1) return false;
      }
    }
    return true;
  }

  moveRight() {
    if (this.checkRight()) this.x += 1;
  }
  moveLeft() {
    if (this.checkLeft()) this.x -= 1;
  }
  moveBottom() {
    if (this.checkBottom()) this.y += 1;
  }
  changeRotation() {
    let solution = [];
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
          realX >= sqaureCountX ||
          realY < 0 ||
          realY <= sqaureCountY
        ) {
          this.template = solution;
          return false;
        }
      }
    }
    return true;
  }
}

const imageSquareSize = 24;
const size = 48;
const framePerSecond = 24;
const gameSpeed = 2;
const canvas = document.getElementById("canvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const scoreCanvas = document.getElementById("scoreCanvas");
const image = document.getElementById("image");
const ctx = canvas.getContext("2d");
const nctx = nextShapeCanvas.getContext("2d");
const sctx = scoreCanvas.getContext("2d");
const sqaureCountX = canvas.width / size;
const sqaureCountY = canvas.height / size;

const shapes = [
  new Tetris(0, 144, [
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 0],
  ]),
  new Tetris(0, 120, [
    [0, 0, 0],
    [1, 1, 1],
    [0, 1, 0],
  ]),
  new Tetris(0, 96, [
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 1],
  ]),
  new Tetris(0, 72, [
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

let gameMap;
let gameOver;
let currentShape;
let nextShape;
let score = 0;
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
      if (t[j].imageX == -1) isComplete = false;
    }
    if (isComplete) {
      console.log(`Complete row`);
      score += 10;
      for (let k = i; k > 0; k--) {
        gameMap[k] = gameMap[k - 1];
      }
      let temp = [];
      for (let j = 0; j < sqaureCountX; j++) {
        temp.push({ imageX: -1, imageY: -1 });
      }
      gameMap[0] = temp;
    }
  }
};

let update = () => {
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

let drawRect = (x, y, w, h, c) => {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
};

let drawBackground = () => {
  drawRect(0, 0, canvas.width, canvas.height, "#bca0dc");

  for (let i = 0; i < sqaureCountX + 1; i++) {
    drawRect(
      size * i - whiteLineThickness,
      0,
      whiteLineThickness,
      canvas.height,
      "white"
    );
  }

  for (let i = 0; i < sqaureCountY + 1; i++) {
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
      if (t[j].imageX == -1) continue;
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
      let measurementThingy = nextShape.imageX + nextShape.imageY / 2;
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
  sctx.fillText(score, 10, 80);
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
  ctx.clearRect(0, 0, canvas?.width, canvas?.height);
  drawBackground();
  drawSqaures();
  drawCurrentTetris();
  drawNextShape();
  drawScore();
  if (gameOver) drawGameOver();
};

let getRandomShape = () => {
  return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};

let resetVars = () => {
  let initialTwoDArr = [];
  for (let i = 0; i < sqaureCountY; i++) {
    let temp = [];
    for (let j = 0; j < sqaureCountX; j++) {
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
