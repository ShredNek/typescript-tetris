var Tetris = /** @class */ (function () {
    function Tetris(imageX, imageY, template) {
        this.imageX = imageX;
        this.imageY = imageY;
        this.template = template;
        this.x = squareCountX / 2.5;
        this.y = -1;
    }
    Tetris.prototype.getTruncedPosition = function () {
        return { x: Math.trunc(this.x), y: Math.trunc(this.y) };
    };
    Tetris.prototype.checkBottom = function () {
        for (var i = 0; i < this.template.length; i++) {
            for (var j = 0; j < this.template.length; j++) {
                if (this.template[i][j] === 0)
                    continue;
                var realX = i + this.getTruncedPosition().x;
                var realY = j + this.getTruncedPosition().y;
                console.log(realX, realY, squareCountY, i, j, Math.trunc(squareCountY) - 1);
                if (realY + 1 >= squareCountY)
                    return false;
                if (gameMap[realY + 1][realX].imageX !== -1)
                    return false;
            }
        }
        return true;
    };
    Tetris.prototype.checkLeft = function () {
        for (var i = 0; i < this.template.length; i++) {
            for (var j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0)
                    continue;
                var realX = i + this.getTruncedPosition().x;
                var realY = j + this.getTruncedPosition().y;
                if (realX - 1 < 0)
                    return false;
                if (gameMap[realY][realX - 1].imageX !== -1)
                    return false;
            }
        }
        return true;
    };
    Tetris.prototype.checkRight = function () {
        for (var i = 0; i < this.template.length; i++) {
            for (var j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0)
                    continue;
                var realX = i + this.getTruncedPosition().x;
                var realY = j + this.getTruncedPosition().y;
                if (realX + 1 >= squareCountX)
                    return false;
                if (gameMap[realY][realX + 1].imageX !== -1)
                    return false;
            }
        }
        return true;
    };
    Tetris.prototype.moveBottom = function () {
        if (this.checkBottom()) {
            this.y += 1;
        }
    };
    Tetris.prototype.moveRight = function () {
        if (this.checkRight()) {
            this.x += 1;
        }
    };
    Tetris.prototype.moveLeft = function () {
        if (this.checkLeft()) {
            this.x -= 1;
        }
    };
    Tetris.prototype.changeRotation = function () {
        var solution = [];
        this.template[0].forEach(function (n) { return solution.push([n]); });
        for (var i = 1; i < this.template.length; i++) {
            for (var j = 0; j < solution.length; j++) {
                solution[j].unshift(this.template[i][j]);
            }
        }
        this.template = solution;
        for (var i = 0; i < this.template.length; i++) {
            for (var j = 0; j < this.template.length; j++) {
                if (this.template[i][j] == 0)
                    continue;
                var realX = i + this.getTruncedPosition().x;
                var realY = j + this.getTruncedPosition().y;
                if (realX < 0 ||
                    realX >= squareCountX ||
                    realY < 0 ||
                    realY <= squareCountY) {
                    return false;
                }
            }
        }
        return true;
    };
    return Tetris;
}());
var canvas = document.getElementById("canvas");
var nextShapeCanvas = document.getElementById("nextShapeCanvas");
var scoreCanvas = document.getElementById("scoreCanvas");
var image = document.getElementById("image");
var ctx = canvas.getContext("2d");
var nctx = nextShapeCanvas.getContext("2d");
var sctx = scoreCanvas.getContext("2d");
var imageSquareSize = 24;
var size = 48;
var framePerSecond = 24;
var gameSpeed = 2;
var squareCountX = canvas.width / size;
var squareCountY = canvas.height / size;
var shapes = [
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
var gameMap;
var gameOver;
var currentShape;
var nextShape;
var score = 0;
var whiteLineThickness = 4;
var gameLoop = function () {
    setInterval(update, 1000 / gameSpeed);
    setInterval(draw, 1000 / framePerSecond);
};
var deleteCompletedRow = function () {
    for (var i = 0; i < gameMap.length; i++) {
        var t = gameMap[i];
        var isComplete = true;
        for (var j = 0; j < t.length; j++) {
            if (t[j].imageX === -1)
                isComplete = false;
        }
        if (isComplete) {
            score += 10;
            for (var k = i; k > 0; k--) {
                gameMap[k] = gameMap[k - 1];
            }
            var temp = [];
            for (var j = 0; j < squareCountX; j++) {
                temp.push({ imageX: -1, imageY: -1 });
            }
            gameMap[0] = temp;
        }
    }
};
var update = function () {
    console.log(currentShape.checkBottom());
    if (gameOver)
        return;
    if (currentShape.checkBottom()) {
        currentShape.y += 1;
    }
    else {
        for (var k = 0; k < currentShape.template.length; k++) {
            for (var l = 0; l < currentShape.template.length; l++) {
                if (currentShape.template[k][l] == 0)
                    continue;
                gameMap[currentShape.getTruncedPosition().y + l][currentShape.getTruncedPosition().x + k] = {
                    imageX: currentShape.imageX,
                    imageY: currentShape.imageY
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
var drawRect = function (x, y, w, h, c) {
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);
};
var drawBackground = function () {
    drawRect(0, 0, canvas.width, canvas.height, "#bca0dc");
    for (var i = 0; i < squareCountX + 1; i++) {
        drawRect(size * i - whiteLineThickness, 0, whiteLineThickness, canvas.height, "white");
    }
    // ? ... and then the height of the grid.
    for (var i = 0; i < squareCountY + 1; i++) {
        drawRect(0, size * i - whiteLineThickness, canvas.width, whiteLineThickness, "white");
    }
};
var drawCurrentTetris = function () {
    for (var i = 0; i < currentShape.template.length; i++) {
        for (var j = 0; j < currentShape.template.length; j++) {
            if (currentShape.template[i][j] == 0)
                continue;
            ctx.drawImage(image, currentShape.imageX, currentShape.imageY, imageSquareSize, imageSquareSize, Math.trunc(currentShape.x) * size + size * i, Math.trunc(currentShape.y) * size + size * j, size, size);
        }
    }
};
var drawSqaures = function () {
    for (var i = 0; i < gameMap.length; i++) {
        var t = gameMap[i];
        for (var j = 0; j < t.length; j++) {
            if (t[j].imageX === -1)
                continue;
            ctx.drawImage(image, t[j].imageX, t[j].imageY, imageSquareSize, imageSquareSize, j * size, i * size, size, size);
        }
    }
};
var drawNextShape = function () {
    nctx.fillStyle = "#bca0dc";
    nctx.fillRect(0, 0, nextShapeCanvas.width, nextShapeCanvas.height);
    for (var i = 0; i < nextShape.template.length; i++) {
        for (var j = 0; j < nextShape.template.length; j++) {
            if (nextShape.template[i][j] == 0)
                continue;
            nctx.drawImage(image, nextShape.imageX, nextShape.imageY, imageSquareSize, imageSquareSize, size * i + 40, size * j + 70, size, size);
        }
    }
};
var drawScore = function () {
    sctx.font = "24px Verdana";
    sctx.fillStyle = "black";
    sctx.clearRect(0, 0, scoreCanvas.width, scoreCanvas.height);
    sctx.fillText("Score:", 10, 30);
    sctx.fillText(score.toString(), 10, 80);
};
var drawGameOver = function () {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "56px Verdana";
        ctx.fillStyle = "black";
        ctx.fillText("Game Over :(", canvas.width / 12, canvas.height / 2 - 120);
        ctx.fillText(" Want to try", canvas.width / 12, canvas.height / 2 - 10);
        ctx.fillText("     again?", canvas.width / 12, canvas.height / 2 + 70);
    }
};
var draw = function () {
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
var getRandomShape = function () {
    return Object.create(shapes[Math.floor(Math.random() * shapes.length)]);
};
var resetVars = function () {
    var initialTwoDArr = [];
    for (var i = 0; i < squareCountY; i++) {
        var temp = [];
        for (var j = 0; j < squareCountX; j++) {
            temp.push({ imageX: -1, imageY: -1 });
        }
        initialTwoDArr.push(temp);
    }
    gameOver = false;
    currentShape = getRandomShape();
    nextShape = getRandomShape();
    gameMap = initialTwoDArr;
};
window.addEventListener("keydown", function (event) {
    if (event.keyCode == 37)
        currentShape.moveLeft();
    else if (event.keyCode == 38)
        currentShape.changeRotation();
    else if (event.keyCode == 39)
        currentShape.moveRight();
    else if (event.keyCode == 40)
        currentShape.moveBottom();
});
resetVars();
gameLoop();
