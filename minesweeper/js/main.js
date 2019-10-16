var ctx = null;

var beginTime = 0, gameTime = 0;
var allMines = 0, remainingMines = 0;

var offsetx = 0, offsety = 0;
var grid = [];

var mouseState = {
	x			: 0,
	y			: 0,
	clickX  	: 0,
	clickY  	: 0,
	clickRight  : false,
	clickLeft   : false
};


var gameState = {
	difficulty	: 'easy',
	screen		: 'menu',
	timeTaken	: 0,

	tileW		: 20,
	tileH		: 20
};

var difficulties = {
	easy		: {
		name		: 'easy',
		width		: 10,
		height		: 10
	},
	medium		: {
		name		: 'medium',
		width		: 12,
		height		: 12
	},
	hard		: {
		name		: 'hard',
		width		: 15,
		height		: 15
	}
};


 function Tile(x, y) {
 	this.x						= x;
 	this.y						= y;
 	this.isMine					= false;
 	this.numberOfAdjacentMines	= 0;
 	this.currentState			= 'hidden';	
 }


 Tile.prototype.calcAdjacentMines = function() {
 	var cDiff = difficulties[gameState.difficulty];

 	for(var py = this.y - 1; py <= this.y + 1; py++) {
 		for(var px = this.x - 1; px <=this.x + 1; px++) {
 			if(py === this.y && px === this.x) { continue; }
 			if(px < 0 || py < 0 || px >= cDiff.width || py >= cDiff.height) { continue; }
 			if(grid[(py * cDiff.width) + px].isMine) {
				this.numberOfAdjacentMines++;
			}	
 		}
 	}
 };


 Tile.prototype.flag = function() {
 	if(this.currentState === 'hidden') {
 		this.currentState = 'flagged';
 		if(this.isMine) {
 			remainingMines--;
 		}
 	}
 	else if(this.currentState === 'flagged') {
 		this.currentState = 'hidden'; 
 		if(this.isMine) {
 			remainingMines++;
 		}
 	}
 };

 
 Tile.prototype.click = function() {
 	if(this.currentState !== 'hidden') {
 		return;
 	}

 	if(this.isMine) {
 		gameOver();
 	} else if(this.numberOfAdjacentMines > 0) {
		this.currentState = 'visible';
	} else {
		this.currentState = 'visible';
 		this.revealNeighbours();
 	}
 	checkState();
 };


Tile.prototype.revealNeighbours = function() {
	var cDiff = difficulties[gameState.difficulty];

	for(var py = this.y - 1; py <= this.y + 1; py++) {
 		for(var px = this.x - 1; px <=this.x + 1; px++) {
 			if(py === this.y && px === this.x) { continue; }
 			if(px < 0 || py < 0 || px >= cDiff.width || py >= cDiff.height) { continue; }

 			var neighbour = ((py * cDiff.width) + px);
 			if(grid[neighbour].currentState === 'hidden') {
 				grid[neighbour].currentState = 'visible';
 				if(grid[neighbour].numberOfAdjacentMines === 0) {
 					grid[neighbour].revealNeighbours();
 				}
 			}
 		}
 	}
};


function checkState() {
	for(var i in grid) {
		if(grid[i].isMine === false && grid[i].currentState !== 'visible') {
			return;
		}
	}
	gameState.timeTaken = gameTime;
	gameState.screen = 'won';
}


function gameOver() {
	gameState.screen = 'lost';
}


function startLevel(mines) {
	document.getElementById("game_result").innerHTML = "";
	if (mines <= 10) {
		gameState.difficulty = 'easy';
	} else if(mines <= 20) {
		gameState.difficulty = 'medium';
	} else {
		gameState.difficulty = 'hard';
	}
	gameState.screen = 'playing';
	grid.length = 0;

	//values will be used when drawing to center the minesweeper grid on the canvas
	var cDiff = difficulties[gameState.difficulty];
	offsetx = Math.floor((document.getElementById("game").width - (cDiff.width * gameState.tileW)) / 2);
	offsety = Math.floor((document.getElementById("game").height - (cDiff.height * gameState.tileW)) / 2);

	for(var py = 0; py < cDiff.height; py++) {
		for(var px = 0; px < cDiff.width; px++) {
			grid.push(new Tile(px, py));
		}
	}

	var minesPlaced = 0;
	while(minesPlaced < mines) {
		var id = Math.floor(Math.random() * grid.length);
		if(grid[id].isMine) { continue; }
		grid[id].isMine = true;
		minesPlaced++;
	}
	for (var i in grid) {
		grid[i].calcAdjacentMines();
	}
	initTime();
}

function initTime()
{
	beginTime = Date.now();
	gameTime = beginTime;
}

function updateGame() {
	if(gameState.screen === 'menu') {
		var mines = document.getElementById("mines").value;
		if (isNaN(mines)) {
			mines = 10;
		} else if (mines < 5) {
			mines = 5;
		} else if (mines > 50) {
			mines = 50;
		}
		if (isNaN(mines) || mines < 5 || mines > 50) {
			mines = 8;
		}
		allMines = mines;
		remainingMines = mines;
		startLevel(mines);

	} else if (gameState.screen === 'won' || gameState.screen === 'lost') {
		if(mouseState.clickLeft) {
			gameState.screen = 'menu';
			mouseState.clickRight = false;
			mouseState.clickLeft = false;
		}
	} else {
		var cDiff = difficulties[gameState.difficulty];
		if(mouseState.clickLeft === true || mouseState.clickRight === true ) {
			if(mouseState.clickX >= offsetx && mouseState.clickY >= offsety &&
				 mouseState.clickX < (offsetx + (cDiff.width * gameState.tileW)) &&
				 mouseState.clickY < (offsety + (cDiff.height * gameState.tileH))) {
				var tile = [
					Math.floor((mouseState.clickX - offsetx)/gameState.tileW),
					Math.floor((mouseState.clickY - offsety)/gameState.tileH)
				];
				if(mouseState.clickLeft) {
					grid[((tile[1] * cDiff.width) + tile[0])].click();
				} else if (mouseState.clickRight){
					grid[((tile[1] * cDiff.width) + tile[0])].flag();
				}
			}
			mouseState.clickLeft = false;
			mouseState.clickRight = false;
		}
	}
}

function newGame() {
	gameState.screen = 'menu';
    mouseState.clickLeft = false;
    mouseState.clickRight = false;
}

function drawPlaying() {
	var halfW = gameState.tileW / 2;
	var halfH = gameState.tileH / 2;
	var cDiff = difficulties[gameState.difficulty];

	if(gameState.screen !== 'lost') {
		document.getElementById("remaining_mines").innerHTML = "Remaining mines: " + remainingMines;


		var whichT = (gameState.screen === 'won' ? gameState.timeTaken : gameTime);
		var allTime = '';
		gameTime = (Date.now() - beginTime)/1000;
		if(gameTime > 60) {
			allTime = Math.floor(whichT  / 60) + ':';
		}

		var seconds = Math.floor(whichT  % 60);
		allTime += (seconds > 9 ? seconds : '0' + seconds);
		document.getElementById("time").innerHTML = "Time: " + allTime;
	}
	if(gameState.screen === 'lost') {
		document.getElementById("game_result").innerHTML = "Game over!";
	} else if(gameState.screen === 'won') {
		document.getElementById("game_result").innerHTML = "You win!";
	}
	//draw bound of game and color of bound
	ctx.strokeStyle = "#999999";
	ctx.strokeRect(offsetx, offsety, (cDiff.width * gameState.tileW), (cDiff.height* gameState.tileH));
	ctx.font = "bold 10pt monospace";
	ctx.textAlign = "center";
	ctx.textBaseline = "middle";

	for(var i in grid) {
		var px = offsetx + (grid[i].x * gameState.tileW);
		var py = offsety + (grid[i].y * gameState.tileH);
		if (gameState.screen === 'lost' && grid[i].isMine) {
			//red with black "x"
			ctx.fillStyle = "#ED002F";
			ctx.fillRect(px, py, gameState.tileW, gameState.tileH);
			ctx.fillStyle = "#000000";
			ctx.fillText("x", px + halfW, py + halfH);
		} else if (grid[i].currentState === 'visible') {
			//grey
			ctx.fillStyle = "#fbfbfb";
			ctx.fillRect(px, py, gameState.tileW, gameState.tileH);
			ctx.strokeRect(px, py, gameState.tileW, gameState.tileH);
			if (grid[i].numberOfAdjacentMines !== 0) {
				if (grid[i].numberOfAdjacentMines === 1) {
					ctx.fillStyle = "#39AECF";
				} else if (grid[i].numberOfAdjacentMines === 2) {
					ctx.fillStyle = "#00B64F";
				} else if (grid[i].numberOfAdjacentMines === 3) {
					ctx.fillStyle = "#ED002F";
				} else if (grid[i].numberOfAdjacentMines === 4) {
					ctx.fillStyle = "#2419B2";
				} else {
					ctx.fillStyle = "#680BAB";
				}
				ctx.fillText(grid[i].numberOfAdjacentMines, px + halfW, py + halfH);
			}
		} else {
			//close gray
			ctx.fillStyle = "#c1ccbf";
			ctx.fillRect(px, py, gameState.tileW, gameState.tileH);
			ctx.strokeRect(px, py, gameState.tileW, gameState.tileH);
			if (grid[i].currentState === 'flagged') {

				//blue "P"
				ctx.fillStyle = "#2419B2";
				ctx.fillText("P", px + halfW, py + halfH);

			}
		}
	}

}

function drawGame() {
	if(ctx == null) { return; }
	updateGame();
	//clear canvas
	ctx.fillStyle = "#beeedb";
	ctx.fillRect(0, 0, 320, 320);

	if(gameState.screen !== 'menu') { drawPlaying(); }

	requestAnimationFrame(drawGame);
}

function realPos(x, y) {
	var p = document.getElementById('game');
	do {
		x -= p.offsetLeft;
		y -= p.offsetTop;

		p = p.offsetParent;
	} while(p != null);
	return [x, y];
}


function start() {
	var game = document.getElementById("game");
	ctx = game.getContext('2d');
	//right button
	game.addEventListener('click', function(e) {
		var pos = realPos(e.pageX, e.pageY);
		mouseState.clickX = pos[0];
		mouseState.clickY = pos[1];
		mouseState.clickLeft = true;
	});
	game.addEventListener('mousemove', function(e) {
		var pos = realPos(e.pageX, e.pageY);
		mouseState.x = pos[0];
		mouseState.y = pos[1];

	});
	//left button
	game.addEventListener('contextmenu', function(e) {
		e.preventDefault();
		var pos = realPos(e.pageX, e.pageY);
			mouseState.clickX = pos[0];
		mouseState.clickY = pos[1];
		mouseState.clickRight = true;
		//know browser that it's ready to begin rendering to call the draw game method
		return false;
	});
	requestAnimationFrame(drawGame);
}