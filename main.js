document.getElementById('info-btn').addEventListener('click', function () {
    document.getElementById('rules').classList.toggle('show');
});

document.getElementById('close-btn').addEventListener('click', function () {
    document.getElementById('rules').classList.remove('show');
});

var direction;
var tilesNum = 225;
var tilesPerRow = Math.sqrt(tilesNum);
var rowStartLeft = new Array();
var rowStartTop = new Array();
var rowEndBottom = new Array();
var rowEndRight = new Array();
var emptyTiles = new Array();
var body = [3, 2, 1];
var moving;
var fruitGenerator;
var powerGenerator;
var gameDiv = document.getElementsByClassName('game')[0];
var boxDimensions = (100 / tilesPerRow).toFixed(3);
var scoreSpan = document.getElementsByClassName('score')[0];
var recordSpan = document.getElementById('record'); // Added this line
var score = 0;
var record = 0; // Added this line
var speed = 0.1;

function updateRecord() {
if (score > record) {
record = score;
recordSpan.innerHTML = record;
}
}

function createGrid() {
for (var i = 1; i <= tilesNum; i++) {
gameDiv.innerHTML = gameDiv.innerHTML + '<div class="tile" data-tile="' + i + '" style="width:' + boxDimensions + '%; height:' + boxDimensions + '%"></div>';
}
}

function createBody() {
for (var i = 1; i <= body.length; i++) {
if (i == 3) {
document.querySelector('[data-tile="' + i + '"]').classList.add("head", "body");
} else if (i == 1 || i == 2) {
document.querySelector('[data-tile="' + i + '"]').classList.add("body");
}
}
}

// Array consisting of upmost left boxes
for (var i = 1; i <= tilesNum; i += tilesPerRow) {
rowStartLeft.push(i);
}

// Array consisting of upmost right boxes
for (var i = tilesPerRow; i <= tilesNum; i += tilesPerRow) {
rowEndRight.push(i);
}

// Array consisting of upmost top boxes
for (var i = 1; i <= tilesPerRow; i += 1) {
rowStartTop.push(i);
}

// Array consisting of upmost bottom boxes
for (var i = (tilesNum - tilesPerRow) + 1; i <= tilesNum; i += 1) {
rowEndBottom.push(i);
}

window.addEventListener("keydown", control, false);

function control(e) {
// RIGHT ARROW or D
if (e.keyCode == "39" || e.key === 'D' || e.key === 'd') {
if (direction != 'r' && direction != 'l') {
changeDirection('r');
}
}

// LEFT ARROW or A
if (e.keyCode == "37" || e.key === 'A' || e.key === 'a') {
if (direction != 'l' && direction != 'r') {
changeDirection('l');
}
}

// DOWN ARROW or S
if (e.keyCode == "40" || e.key === 'S' || e.key === 's') {
if (direction != 'd' && direction != 'u') {
changeDirection('d');
}
}

// UP ARROW or W
if (e.keyCode == "38" || e.key === 'W' || e.key === 'w') {
if (direction != 'u' && direction != 'd') {
changeDirection('u');
}
}
}

function changeDirection(d) {
var directionDeciderNum,
directionArrayInit,
directionArrayOf;
switch (d) {
case "r":
directionDeciderNum = 1;
directionArrayInit = rowEndRight;
directionArrayOf = rowStartLeft;
break;
case "l":
directionDeciderNum = -1;
directionArrayInit = rowStartLeft;
directionArrayOf = rowEndRight;
break;
case "d":
directionDeciderNum = tilesPerRow;
directionArrayInit = rowEndBottom;
directionArrayOf = rowStartTop;
break;
case "u":
directionDeciderNum = -tilesPerRow;
directionArrayInit = rowStartTop;
directionArrayOf = rowEndBottom;
break;
}

clearInterval(moving);

moving = setInterval(function () {
direction = d;
var head = document.getElementsByClassName('head')[0];
var nextTileNum = directionArrayInit.indexOf(parseInt(head.dataset.tile, 10)) > -1 ? directionArrayOf[directionArrayInit.indexOf(parseInt(head.dataset.tile, 10))] : parseInt(head.dataset.tile, 10) + directionDeciderNum;
if (body.indexOf(nextTileNum) > -1) {
scoreSpan.innerHTML = +score + ". GAME OVER";
restartGame();
} else {
var nextTile = document.querySelector('[data-tile ="' + nextTileNum + '"]');

var lastTile = document.querySelector('[data-tile ="' + body[body.length - 1] + '"]');
body.unshift(nextTileNum);

nextTile.classList.add("head", "body");

// IF EATEN FRUIT
if (nextTile.classList.contains('fruit')) {
score += 1;
scoreSpan.innerHTML = score;
speed = score % 2 == 0 ? speed += 0.01 : speed;
nextTile.classList.remove('fruit');
clearInterval(fruitGenerator);
generateFruit();
fruitGen();
}

// IF JUST MOVING
else {
lastTile.classList.remove("body");
body.pop();
};
head.classList.remove("head");
}
}, 10 / speed);
}

function generateFruit() {
var rand;
var fruit = document.getElementsByClassName('fruit')[0];
if (fruit) {
fruit.classList.remove('fruit');
}
do {
rand = Math.floor(Math.random() * tilesNum);
} while (body.indexOf(rand) > -1);
document.querySelector('[data-tile ="' + rand + '"]').classList.add('fruit');
}

function fruitGen() {
fruitGenerator = setInterval(function () {
generateFruit();
}, 30000)
};

function startGame() {
createGrid();
createBody();
generateFruit();
}

function restartGame() {
scoreSpan.innerHTML = +score + ". GAME OVER";
updateRecord(); // Added: Update record when game is over
clearInterval(fruitGenerator);
clearInterval(moving);
body = [3, 2, 1];
speed = 0.1;
score = 0;
document.querySelector('.game').innerHTML = "";
direction = '';
startGame();
}

startGame();