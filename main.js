var gameStatus;
var cleanUpNeeded = false;
var levelStartTime = 0;
var level;
var tileSize = 100;
var player;
var playerStartLocation = [0, 0];
var tiles = [];
var enemies = [];
var friendlyProjectiles = [];
var explosions = [];
var ctx;
var bgCtx;
var viewport = $(window);
var WIDTH = viewport.width();
var HEIGHT = viewport.height();
var requestAnimFrame = window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
										window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var keysPressed = [];
//testing
var framesShown = 0;


function init() {
	var canvas = $("#canvas");
	var bgCanvas = $("#canvas-background");
	canvas[0].height = HEIGHT;
	bgCanvas[0].height = canvas[0].height;
	canvas[0].width = WIDTH;
	bgCanvas[0].width = canvas[0].width
	ctx = canvas[0].getContext("2d");
	bgCtx = bgCanvas[0].getContext("2d");
	
	initInput();
	//reset();
	gameStatus = "main menu";
	$("#start-game").click(function() {
		gameStatus = "level intro";
		level = 1;
		$("#main-menu").hide();
		$("#level-intro").css("display", "inline-block");
		window.setTimeout(function() {
			generateLevelTiles(level);
			startLevel(level);
		}, 1); //### change this time after testing is complete! (3000 ms? 2000?)
	})
	lastTime = Date.now();
	//###for testing only
	$("#start-game").click();

	return requestAnimFrame(main);
}

function main() {
	/*framesShown++;
	if (framesShown > 1000) {
		//return;
	}*/
	var now = Date.now();
	var secSinceLastUpdate = (now - lastTime) / 1000;
	/*if (secSinceLastUpdate > 0.16) {
		if (now - startTime > 1000 && gameStarted) {
			//user has probably minimized the window or focused on a different tab
			pause();
			return;
		}
	}*/
	update(secSinceLastUpdate);
	render();
	
	lastTime = now;
	//gameStarted = true;
	
	if (gameStatus != "game over" && gameStatus != "paused") {
		requestAnimFrame(main);
	} else if (gameStatus == "game over") {
		stopGame();
	}


}

function update(secSinceLastUpdate) {
	switch(gameStatus) {
		case "playing level":
			elapsedSeconds = (Date.now() - levelStartTime) / 1000;
			updateEntities(secSinceLastUpdate);
			checkCollisions();
			if (cleanUpNeeded) {
				cleanUp();
			}
			break;
	}
}

function generateLevelTiles(levelNum) {
	for (var row = 0; levels[levelNum]["row" + row]; row++) {
		var x = 0;
		var y = row * tileSize;
		$.each(levels[levelNum]["row" + row], function(index, tileLayers) {
			switch(tileLayers[0]) {
				case "blank tile":
					tiles.push(new blankTile(x, y));
					break;
				case "brick":
					tiles.push(new brickTile(x, y));
					break;
				case "player location":
					tiles.push(new playerLocation(x, y));
					break;
			}
			x += tileSize;
		});
	}
}

function startLevel(levelNum) {
	$("#level-intro").css("display", "none");
	player = new moses(playerStartLocation[0], playerStartLocation[1]);
	gameStatus = "playing level";
}

resources.load([
	"images/helicopter.png",
	"images/moses.png",
	"images/brick.png",
	"images/blankTile.png",
	"images/w.png",
	"images/playerLocation.png"
]);

resources.onReady(init);
