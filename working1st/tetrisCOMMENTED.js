class Tetris {
  // ? Allows us to re-use same parameters for each tetroid
  constructor(imageX, imageY, template) {
    // ? Determines what X & Y pixels to use as tetroid piece building brick
    this.imageY = imageY;
    this.imageX = imageX;
    // ? Takes matrix template to easily organise shape
    this.template = template;
    // ? Determines where default location of squares. They will be added or
    // ? subtracted from to determine a new location.
    this.x = squareCountX / 2.5;
    this.y = -1;
  }

  // * Internal functions for the Tetris class.

  getTruncedPosition() {
    // ?　Calculates the location of each piece as a whole integer.
    return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
  }

  checkBottom() {
    // ? The below code scans the matrix template of each tetroid...
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        // ? ... ignoring all the 0's in the template...
        if (this.template[i][j] == 0) continue;
        // ? ... calculates the accurate position by removing deicmal numbers...
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        // ? ... checks if there's still room to move down the map (upon creation),
        // ? and returning false if there's no more room below.
        if (realY + 1 >= squareCountY) return false;
        // ? this second statement is called if the piece has not hit the floor of the
        // ? gameMap, but we land on a piece that is assigned -1. This is handeled in
        // ? the 'update' function.
        if (gameMap[realY + 1][realX].imageX != -1) return false;
      }
    }
    // ? ... and ultimately returns True if there's room below.
    return true;
  }

  checkLeft() {
    // ? The below code scans the matrix template of each tetroid...
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        // ? ... ignoring all the 0's in the template...
        if (this.template[i][j] == 0) continue;
        // ? ... calculates the accurate position by removing deicmal numbers...
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        // ? ... checks if there's still room to move down the map, by returning
        // ? false if there's no more room to the left.
        if (realX - 1 < 0) return false;
        // TODO This was hard to understand at first
        // ? ... checking that we've hit the edge of the gameMap (side of the game)...
        if (gameMap[realY][realX - 1].imageX !== -1) return false;
      }
    }
    // ? ... and ultimately returns True if there's room to the left.
    return true;
  }

  checkRight() {
    // ? The below code scans the matrix template of each tetroid...
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        // ? ... ignoring all the 0's in the template...
        if (this.template[i][j] == 0) continue;
        // ? ... calculates the accurate position by removing deicmal numbers...
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        // ? ... checks if there's no more room to the right ...
        if (realX + 1 >= squareCountX) return false;
        // TODO This was hard to understand at first
        // ? ... checking that we've hit the edge of the gameMap (side of the game)...
        if (gameMap[realY][realX + 1].imageX !== -1) return false;
      }
    }
    // ? ... and ultimately returns True if there's room to the right.
    return true;
  }

  moveBottom() {
    // ? Checks the function if there's room to move ...
    // ? ... if false, no movement, if true...
    if (this.checkBottom()) {
      // ? ... this code is executed.
      this.y += 1;
    }
  }

  moveRight() {
    // ? Checks the function if there's room to move ...
    // ? ... if false, no movement, if true...
    if (this.checkRight()) {
      // ? ... this code is executed.
      this.x += 1;
    }
  }

  moveLeft() {
    // ? Checks the function if there's room to move ...
    // ? ... if false, no movement, if true...
    if (this.checkLeft()) {
      // ? ... this code is executed.
      this.x -= 1;
    }
  }

  changeRotation() {
    // TODO one of the more complex algorithms
    // ? We need to rotate the piece.
    // ? So, we start with an empty array...
    let solution = [];
    // ? ... where we push in the top of the matrix
    // ? to the right, via creating new array with each
    // ? index taking the 0th position ...
    this.template[0].forEach((n) => solution.push([n]));
    // ? ... and then for the rest of the old matrix
    // ? we unshift the remaining rows onto each array,
    // ? creating new columns, repeating for the length
    // ? and width of the original matrix.
    for (let i = 1; i < this.template.length; i++) {
      for (let j = 0; j < solution.length; j++) {
        solution[j].unshift(this.template[i][j]);
      }
    }
    // ? Re-assign our template to the solution
    this.template = solution;
    // ? Checking that we have space to rotate ...
    for (let i = 0; i < this.template.length; i++) {
      for (let j = 0; j < this.template.length; j++) {
        // ? ... the 0's are irrelevant as they're an empty space ...
        if (this.template[i][j] == 0) continue;
        // TODO ... variables determining how much space
        let realX = i + this.getTruncedPosition().x;
        let realY = j + this.getTruncedPosition().y;
        // ? This checks...
        if (
          // ? - if there's no more room on the x axis
          realX < 0 ||
          // ? - if the piece is next to a filled square
          realX >= squareCountX ||
          // ? - if there's no more room on the y axis
          realY < 0 ||
          // ? - if the piece is next to a filled square
          realY <= squareCountY
        ) {
          // ? ... and ultimately returns false if these conditions are
          // ? satisfied. And if not ...
          return false;
        }
      }
    }
    // ? ... then there's room to rotate.
    return true;
  }
}

// * declaring elements of HTMl to be manipulated

const canvas = document.getElementById("canvas");
const nextShapeCanvas = document.getElementById("nextShapeCanvas");
const scoreCanvas = document.getElementById("scoreCanvas");
const image = document.getElementById("image");
const ctx = canvas.getContext("2d");
const nctx = nextShapeCanvas.getContext("2d");
const sctx = scoreCanvas.getContext("2d");

// * decalring variables to abstain from "magic numbers".

// ? Param for HTML Canvas Context - determining tetroid square size
const imageSquareSize = 24;

// ? Param for HTML Canvas Context - determining grid square size
const size = 48;

// ? determines how quickly the game updates the pieces upon changing moving
const framePerSecond = 24;

// ? determines how fast the game progresses
const gameSpeed = 2;

// ? calculates how many squares the grid will host, calculated by
// ? the canvas' height & width, each divided by the size of the grid square
const squareCountX = canvas.width / size;
const squareCountY = canvas.height / size;

// * different template shapes for each Tetroids

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

// * declaring assorted mutable variables

// ? is the map of the game - is set a value via 'resetVars'
// ? (it is set when it scans how many sqaures are on the grid)
let gameMap;
let gameOver;
let currentShape;
let nextShape;
let score = 0;
let whiteLineThickness = 4;

// ? allows us to loop the game until the update function
// ? breaks the setInterval.
let gameLoop = () => {
  setInterval(update, 1000 / gameSpeed);

  // ? upon each sucessful update
  setInterval(draw, 1000 / framePerSecond);
};

let deleteCompletedRow = () => {
  // ? it's hard to find, but the gameMap is aptly named - it's
  // ? assigned a huge array of -1's to indicate nothing's
  // ? filled a sqaure's spot.
  // ! This will be important.
  // ? It scans the game map...
  for (let i = 0; i < gameMap.length; i++) {
    let t = gameMap[i];
    // ? we start assuming that the row is complete, as there
    // ? is a lot to check against it, and it's easier to not keep count..
    let isComplete = true;
    for (let j = 0; j < t.length; j++) {
      // ! ... and turn the variable to false upon finding the first -1,
      // ! to indicate that the row is not complete.
      if (t[j].imageX === -1) isComplete = false;
    }
    // ? and if the row is infact complete...
    if (isComplete) {
      // ? ... then we incriment the score ...
      score += 10;
      // ? ... we take the top most row and it is reassgined the value of
      // ? the one below it ... hence why we're decrementing this for loop ...
      for (let k = i; k > 0; k--) {
        gameMap[k] = gameMap[k - 1];
      }
      let temp = [];
      // ? ... and then we reset the top of the gameMap with each
      // ? completed row in this for loop.
      for (let j = 0; j < squareCountX; j++) {
        temp.push({ imageX: -1, imageY: -1 });
      }
      gameMap[0] = temp;
    }
  }
};

let update = () => {
  // ? If it's a game over, we break the gameLoop (in which this 'update'
  // ? function is contained within) and we therefore cease the game
  // ? from continuing.
  if (gameOver) return;
  // ? We check if the bottom of the piece can move down, and if it can,
  // ? we move the piece's y axis by
  if (currentShape.checkBottom()) {
    currentShape.y += 1;
    // ! This is the first catch of a checkBottom returning False !
  } else {
    // ? If the piece can't move, we then scan the template's
    // ? height and length ...
    for (let k = 0; k < currentShape.template.length; k++) {
      for (let l = 0; l < currentShape.template.length; l++) {
        // ? ... ignoring any 0s (meaning, empty spaces) ...
        if (currentShape.template[k][l] == 0) continue;
        // ? ... and we reassign the values of empthy spaces, now taken up,
        // ? via the gameMap. This is done by scanning of the height and width
        // ? of the Tetropid, and reassigning the relevant gameMaps -1 values
        // ? to 1 (as found in the currentShape's imageX & image Y values).
        gameMap[currentShape.getTruncedPosition().y + l][
          currentShape.getTruncedPosition().x + k
        ] = {
          imageX: currentShape.imageX,
          imageY: currentShape.imageY,
        };
      }
    }

    // ? Check if a row is complete and deletes it
    deleteCompletedRow();
    // ? Re-assigns the current shape and fetches the next shape
    currentShape = nextShape;
    nextShape = getRandomShape();

    // ! This is the second catch of a checkBottom returning False !
    if (!currentShape.checkBottom()) {
      // ? Since we can't resolve the piece failing a checkBottom() twice,
      // ? this fails the game. (as there are two statement's in place -
      // ? one to catch if the piece has no room to go when spawning, the
      // ? other when it falls ontop of another set piece)
      gameOver = true;
    }
  }
};

// * This is a helper function that sets up our drawBackground function

let drawRect = (x, y, w, h, c) => {
  ctx.fillStyle = c;
  ctx.fillRect(x, y, w, h);
};

let drawBackground = () => {
  // ? first we draw the background ...
  drawRect(0, 0, canvas.width, canvas.height, "#bca0dc");

  // ? ... then the width of the grid ...
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

// ? This draws out the current Tetroid
let drawCurrentTetris = () => {
  // ? ... by checking the height and width ...
  for (let i = 0; i < currentShape.template.length; i++) {
    for (let j = 0; j < currentShape.template.length; j++) {
      // ? ... checking if it's a 0, then ignoring it if so ...
      if (currentShape.template[i][j] == 0) continue;
      // ? ... and using the parameters fed to a new instance of
      // ? Tetris, we then use the object's values & preset variables
      // ? in this function.
      ctx.drawImage(
        // ? we take the source...
        image,
        // ? ... it's imageX and imageY value ...
        currentShape.imageX,
        currentShape.imageY,
        // ? ... it's preset image height & width (which are the same) ...
        imageSquareSize,
        imageSquareSize,
        // ? ... then we calculate the location of the pieces
        // ? by it's current location by the size of the cube,
        // ? and by how tall and long the Tetroid's template is ...
        Math.trunc(currentShape.x) * size + size * i,
        Math.trunc(currentShape.y) * size + size * j,
        // ? ... and finally the image height & width
        size,
        size
      );
    }
  }
};

// ? This draws out the sqaures that have landed on the grid
let drawSqaures = () => {
  // ? Scan the hight of the gameMap ...
  for (let i = 0; i < gameMap.length; i++) {
    // ? ... declare a helper variable ...
    let t = gameMap[i];
    // ? ... and for each sqaure of the map ...
    for (let j = 0; j < t.length; j++) {
      // ? ... ignore it if the .imageX of the cube is not filled ...
      if (t[j].imageX == -1) continue;
      // ? ... and draw the image ...
      ctx.drawImage(
        // ? ... using the image source ...
        image,
        // ? ... the imageX & imageY of the filled cube ...
        t[j].imageX,
        t[j].imageY,
        // ? ... the predetermined length of the imageSquare ...
        imageSquareSize,
        imageSquareSize,
        // ? ... the X and Y position of the tetroid ...
        j * size,
        i * size,
        // ? ... and the length & height of the tetroid.
        size,
        size
      );
    }
  }
};

// ? This draws the 'Next Shape' canvas, previewing the next Tetroids
let drawNextShape = () => {
  nctx.fillStyle = "#bca0dc";
  // ? Creating a new background for the shapes to be drawn ...
  nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
  // ? ... then scan the height ...
  for (let i = 0; i < nextShape.template.length; i++) {
    // ? ... and the width ...
    for (let j = 0; j < nextShape.template.length; j++) {
      // ? ... ignoring 0s ...
      if (nextShape.template[i][j] == 0) continue;
      // ? ... and drawing the image in the nextShapeCanvas
      nctx.drawImage(
        // ? ... referencing the image ...
        image,
        // ? ... the location within the referenced image ...
        nextShape.imageX,
        nextShape.imageY,
        // ? ... the referenced images's width & hight ...
        imageSquareSize,
        imageSquareSize,
        // ? ... and finally drawing the shape's location ...
        size * i + 40,
        size * j + 70,
        // ? ... then the shapes height & width ...
        size,
        size
      );
    }
  }
};

// ? This draws the canvas for the Score
let drawScore = () => {
  // ? Styles for the text ...
  sctx.font = "24px Verdana";
  sctx.fillStyle = "black";
  // ? ... wipes the rectangle upon update ...
  sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
  // ? ... and draws the heading and dynamic score variable.
  sctx.fillText("Score:", 10, 30);
  sctx.fillText(score, 10, 80);
};

// ? This draws the canvas for the Game Over prompt
let drawGameOver = () => {
  // ? Checks to see if player has lost ...
  if (gameOver) {
    // ? ... wipes the rectangle upon update ...
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // ? ... styles for the text ...
    ctx.font = "56px Verdana";
    ctx.fillStyle = "black";
    // ? ... and the text itself. I needed to manually space out the lines
    // ? as canvas is hard to work with in regards to creating text.
    ctx.fillText("Game Over :(", canvas.width / 12, canvas.height / 2 - 120);
    ctx.fillText(" Want to try", canvas.width / 12, canvas.height / 2 - 10);
    ctx.fillText("     again?", canvas.width / 12, canvas.height / 2 + 70);
  }
};

// ? A huge function that determines the order for which the above
// ? 'drawFooBar' functions are ordered.
let draw = () => {
  // ? clear the background ...
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // ? ... draw the background again ...
  drawBackground();
  // ? ... draw the squares that have fallen into place ...
  drawSqaures();
  // ? ... draw the current Tetroid ...
  drawCurrentTetris();
  // ? ... draw the next Tetroid (and subsiquently place it in
  // ? the Next Shape Canvas) ...
  drawNextShape();
  // ? ... draw the score ...
  drawScore();
  // ? ... and finally, if the player lost, draw the Game Over Screen ...
  if (gameOver) {
    drawGameOver();
  }
};

// ? generates random shape from shapes array
let getRandomShape = () => {
  return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};

// ? this function restores the gameMap to a TwoDArr, which defaults
// ? the gameMap to an empty map, as well as reseting variables
// ? that would end the game & begin the shape drawing cycle.
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

// ? different key bindings to trigger different functions
window.addEventListener("keydown", (event) => {
  if (event.keyCode == 37) currentShape.moveLeft();
  else if (event.keyCode == 38) currentShape.changeRotation();
  else if (event.keyCode == 39) currentShape.moveRight();
  else if (event.keyCode == 40) currentShape.moveBottom();
});

// * these two functions are called to begin the game

resetVars();
gameLoop();

// TODO Questions I need to have answers to
// # How does control go from one tetroid to the next?
// * Control is relinquished when the first Tetroid we control fails it's
// * checkBottom function, and then either we lose the game, or we are
// * re-assigned another piece, whilst the piece we once controlled become
// * a part of the gameMap.

// # How does a shape stay in place after it's been used?
// * Once a piece fails it's checkBottom function once, we convert
// * the empty spaces on the grid to non-empty spaces, via means of reassigning
// * the -1 values of empty space into 1's.

// # How is a game over signaled?
// * The game over is signalled when the checkBottom on a piece fails twice,
// * as there are two conditions in play - one to check if it's reached a
// * non-empty space and the other to check if the height of the map is greater
// * than the location of the newest Tetroid. Because this function is called
// * upon creation, if both these conditions fail simultaneously, the game is over.
