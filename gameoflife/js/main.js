
var ctx = null;
var grid = [];
var timerId;
var praysAtTheBeginning = 0, remainingPrays = 0;
var predatorsAtTheBeginning = 0, remainingPredators = 0;
var iterationsAtTheBeginning = 0, iterations = 0;

function Tile(x, y) {
    this.x             = x;
    this.y             = y;
    this.hasPray       = false;
    this.hasPredator   = false;
    this.age           = 0;
    this.updated       = false;

}

var gameState = {
    screen		            : 'menu',
    size                    : 0,
    praysReproPeriod        : 0,
    predatorsReproPeriod    : 0,
    predatorsLife           : 0,

    tileSize		        : 0
};

function setUp() {
    var size = document.getElementById("size").value;
    if (isNaN(size) || size === "") {
        size = 30;
    }
    if(size > 100) {
        size =  100;
    }
    if(size < 4) {
        size =  4;
    }
    gameState.size = Math.floor(size);

    var praysReproPeriod = document.getElementById("praysReproPeriod").value;
    if (isNaN(praysReproPeriod) || praysReproPeriod === "") {
        praysReproPeriod = 10;
    }
    if(praysReproPeriod < 0) {
        praysReproPeriod = 0;
    }
    if(praysReproPeriod > 100) {
        praysReproPeriod =  100;
    }
    gameState.praysReproPeriod = Math.floor(praysReproPeriod);

    var predatorsReproPeriod = document.getElementById("predatorsReproPeriod").value;
    if (isNaN(predatorsReproPeriod) || predatorsReproPeriod === "") {
        predatorsReproPeriod = 10;
    }
    if(predatorsReproPeriod < 0) {
        predatorsReproPeriod =  0;
    }
    if(predatorsReproPeriod > 100) {
        predatorsReproPeriod =  100;
    }
    gameState.predatorsReproPeriod = Math.floor(predatorsReproPeriod);

    var predatorsLife = document.getElementById("predatorsLife").value;
    if (isNaN(predatorsLife) || predatorsLife === "" || predatorsLife < 2) {
        predatorsLife = 5;
    }
    if(predatorsLife > 100) {
        predatorsLife =  100;
    }
    gameState.predatorsLife = Math.floor(predatorsLife);

    var praysCount = document.getElementById("prays").value;
    if (isNaN(praysCount) || praysCount === "") {
        praysCount = 5;
    }
    if(praysCount < 1) {
        praysCount =  1;
    }
    if(praysCount > gameState.size) {
        praysCount =  gameState.size;
    }
    praysAtTheBeginning = Math.floor(praysCount);
    remainingPrays = praysAtTheBeginning;

    var predatorsCount = document.getElementById("predators").value;
    if (isNaN(predatorsCount) || predatorsCount === "") {
        predatorsCount = 5;
    }
    if(predatorsCount < 1) {
        predatorsCount =  1;
    }
    if(predatorsCount > gameState.size) {
        predatorsCount =  gameState.size;
    }
    predatorsAtTheBeginning = Math.floor(predatorsCount);
    remainingPredators = predatorsAtTheBeginning;

    var iter = document.getElementById("iterations").value;
    if (isNaN(iter) || iter === "") {
        iter = 2000;
    }
    if(iter < 10) {
        iter = 10;
    }
    if(iter  > 10000) {
        iter = 10000;
    }
    iterationsAtTheBeginning = Math.floor(iter);

    grid.length = 0;
    gameState.tileSize = Math.floor(document.getElementById("game").width / gameState.size);

    fillFields();

    gameState.screen = 'playing';
}

function fillFields(){

    for(var px= 0; px < gameState.size; px++) {
        grid[px] = [];
        for(var py = 0; py < gameState.size; py++) {
            grid[px][py] = new Tile(px, py);
        }
    }

    var praysPlaced = 0;
    while(praysPlaced < praysAtTheBeginning) {
        var idx = Math.floor(Math.random() * gameState.size);
        var idy = Math.floor(Math.random() * gameState.size);
        if(grid[idx][idy].hasPredator || grid[idx][idy].hasPray) { continue; }
        grid[idx][idy].hasPray = true;
        praysPlaced++;
    }


    var predatorsPlaced = 0;
    while(predatorsPlaced < predatorsAtTheBeginning) {
        var idx = Math.floor(Math.random() * gameState.size);
        var idy = Math.floor(Math.random() * gameState.size);
        if(grid[idx][idy].hasPray || grid[idx][idy].hasPredator) { continue; }
        grid[idx][idy].hasPredator = true;
        grid[idx][idy].age = 1;
        predatorsPlaced++;
    }
}


Tile.prototype.findNeighbors = function() {
    var mas = [
        grid[ifSmall(this.x) - 1][this.y],
        grid[this.x][ifBig(this.y) + 1],
        grid[ifBig(this.x) + 1][this.y],
        grid[this.x][ifSmall(this.y) - 1],
        grid[ifSmall(this.x) - 1][ifBig(this.y) + 1],
        grid[ifBig(this.x) + 1][ifBig(this.y) + 1],
        grid[ifBig(this.x) + 1][ifSmall(this.y) - 1],
        grid[ifSmall(this.x) - 1][ifSmall(this.y) - 1]
    ];
    return mas;
};

function ifSmall(i){
    if(i === 0) { return gameState.size; }
    else { return i; }

}
function ifBig(i){
    if(i === (gameState.size - 1)) { return -1; }
    else { return i; }
}


Tile.prototype.predatorDoStep = function() {
    if(this.age >= gameState.predatorsLife) {
         this.hasPredator = false;
         this.age = 0;
         remainingPredators--;
    }
   if(this.hasPredator) {
        var availableTiles = [];
        var myPray = [];
        var neighbors = this.findNeighbors();
        for (var id in neighbors) {
            if (neighbors[id].updated || neighbors[id].hasPredator) {
                continue;
            }
            if (neighbors[id].hasPray) {
                myPray.push(neighbors[id]);
                break;
            }
            availableTiles.push(neighbors[id]);
        }
        if (myPray.length !== 0) {
            grid[myPray[0].x][myPray[0].y].hasPray = false;
            grid[myPray[0].x][myPray[0].y].hasPredator = true;
            grid[myPray[0].x][myPray[0].y].age = 1;
            grid[myPray[0].x][myPray[0].y].updated = true;
            this.hasPredator = false;
            this.age = 0;
            remainingPrays--;
        }
        else if (availableTiles.length !== 0) {
            var id = Math.floor(Math.random() * availableTiles.length);
            grid[availableTiles[id].x][availableTiles[id].y].hasPredator = true;
            grid[availableTiles[id].x][availableTiles[id].y].age = this.age + 1;
            grid[availableTiles[id].x][availableTiles[id].y].updated = true;
            this.hasPredator = false;
            this.age = 0;
        } else {
            this.age++;
        }
    }

};

Tile.prototype.prayDoStep = function() {
    if(this.hasPray) {
        var availableTiles = [];
        var neighbors = this.findNeighbors();
        for (var id in neighbors) {
            if (neighbors[id].updated || neighbors[id].hasPray || neighbors[id].hasPredator) {
                continue;
            }
            availableTiles.push(neighbors[id]);
        }
        if (availableTiles.length !== 0) {
            var id = Math.floor(Math.random() * availableTiles.length);
            grid[availableTiles[id].x][availableTiles[id].y].hasPray = true;
            grid[availableTiles[id].x][availableTiles[id].y].updated = true;
            this.hasPray = false;
        }
    }

};


Tile.prototype.multiply = function() {
    var availableTiles = [];
    var neighbors = this.findNeighbors();
    for (var id in neighbors) {
        if (neighbors[id].updated || neighbors[id].hasPray || neighbors[id].hasPredator) {
            continue;
        }
        availableTiles.push(neighbors[id]);
    }
    if (availableTiles.length !== 0) {
        var id = Math.floor(Math.random() * availableTiles.length);
        if(this.hasPredator) {
            grid[availableTiles[id].x][availableTiles[id].y].hasPredator = true;
            grid[availableTiles[id].x][availableTiles[id].y].updated = true;
            remainingPredators++;
        } else if (this.hasPray) {
            grid[availableTiles[id].x][availableTiles[id].y].hasPray = true;
            grid[availableTiles[id].x][availableTiles[id].y].updated = true;
            remainingPrays++;
        }
    }
};


function drawField(){
    for (var px = 0; px < grid.length; px++){
        for (var py = 0; py < grid[px].length; py++){
            if (grid[px][py].hasPray) {
                ctx.fillStyle = "#23bd63";
                ctx.fillRect(grid[px][py].x * gameState.tileSize, grid[px][py].y * gameState.tileSize, gameState.tileSize, gameState.tileSize);
            }
            if (grid[px][py].hasPredator) {
                ctx.fillStyle = "#c92831";
                ctx.fillRect(grid[px][py].x * gameState.tileSize, grid[px][py].y  * gameState.tileSize, gameState.tileSize, gameState.tileSize);
            }
        }
    }
}


function checkState() {
    if(remainingPrays <= 0 || remainingPredators <= 0 || iterations >= iterationsAtTheBeginning) {
        gameState.screen = 'finish';
    }
}

function updateGame() {
        for (var px = 0; px < grid.length; px++){
            for (var py = 0; py < grid[px].length; py++){
                if (grid[px][py].hasPredator) {
                    if(grid[px][py].updated === false) {
                        grid[px][py].predatorDoStep();
                    } else {
                        grid[px][py].updated = false;
                    }
                }
            }
        }
        for (var px = 0; px < grid.length; px++){
            for (var py = 0; py < grid[px].length; py++){
                if (grid[px][py].hasPray) {
                    if (grid[px][py].updated === false) {
                        grid[px][py].prayDoStep();
                    } else {
                        grid[px][py].updated = false;
                    }
                }
            }
        }
        if(iterations % gameState.predatorsReproPeriod == 0 &&  gameState.predatorsReproPeriod !== 0) {
            for (var px = 0; px < grid.length; px++){
                for (var py = 0; py < grid[px].length; py++){
                    if (grid[px][py].hasPredator) {
                        if (grid[px][py].updated === false) {
                            grid[px][py].multiply();
                        }else {
                            grid[px][py].updated = false;
                        }
                    }
                }
            }
        }
        if(iterations % gameState.praysReproPeriod == 0 && gameState.praysReproPeriod !== 0) {
            for (var px = 0; px < grid.length; px++){
                for (var py = 0; py < grid[px].length; py++){
                    if (grid[px][py].hasPray) {
                        if (grid[px][py].updated === false) {
                             grid[px][py].multiply();
                        } else {
                            grid[px][py].updated = false;
                        }
                    }
                }
            }
        }
        drawField();
        checkState();
}


function newGame() {
    clearTimeout(timerId);
    gameState.screen = 'menu';
    iterations = 0;
    document.getElementById("game_result").innerHTML = "";
    requestAnimationFrame(drawGame);
}

function drawGame() {
    if(ctx == null) { return; }
    if (gameState.screen === 'menu') {
        setUp();
        drawField();
    }
    if(gameState.screen === 'playing') {
        //clear canvas
        ctx.fillStyle = "rgb(11,11,11)";
        ctx.fillRect(0, 0, 500, 500);
        iterations++;
        updateGame();
    }
    if(gameState.screen === 'finish') {
        document.getElementById("game_result").innerHTML = "FINISH!";
    }
    document.getElementById("iterator").innerHTML = iterations.toString();
    document.getElementById("remaining_predators").innerHTML = remainingPredators;
    document.getElementById("remaining_preys").innerHTML = remainingPrays;

    timerId = setTimeout(drawGame, 300);
}


function start() {
    var game = document.getElementById("game");
    ctx = game.getContext('2d');
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 500, 500);
}
