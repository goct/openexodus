function reset() {
	$("#high-score").html(score);
	friendlyProjectiles = [];
	explosives = [];
	hostileProjectiles = [];
	bricks = [];
	explosions = [];
	
	enemies = [];
	enemyDeaths = [];
	player = new moses(5, 5);
	gameOverScreenInstance = new gameOverScreen();
	
	startTime = Date.now();
}

function pause() {
	scoreDisplay.html('paused');
	paused = true;
}

function unpause() {
	var now = Date.now();
	startTime = now - elapsedSeconds * 1000;
	lastTime = now;
	paused = false;
	scoreDisplay.html(score);
	requestAnimFrame(main);
}