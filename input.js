function initInput() {
	/*
	=========
	controls:
	=========
	move left: left
	move right: right
	move up: up
	move down: down
	shoot Ws: space
	*/
	//input keycodes
	var leftArrowKey = 37;
	var upArrowKey = 38;
	var rightArrowKey = 39;
	var downArrowKey = 40;
	var spaceBar = 32;
	var zKey = 90;
	var xKey = 88;
	var cKey = 67;
	var pKey = 80;
	var oKey = 79;
	var aKey = 65;

	$("body").keydown(function(event) {
		if ([leftArrowKey, rightArrowKey, upArrowKey, downArrowKey].indexOf(event.keyCode) != -1) {
			//pressed a direction
			event.preventDefault();
			if (keysPressed.indexOf(event.keyCode) == -1) {
				keysPressed.push(event.keyCode);
			}
		} else {
			switch(event.keyCode) {
				case spaceBar:
					event.preventDefault();
					if (gameStatus == "playing level") {
						player.primaryWeaponFiring = "ws";
					}/* else {
						gameOver = false;
						reset();
						requestAnimFrame(main);
					}*/
					break;
				/*case cKey:
					if (enableStopEnemiesButton) {
						event.preventDefault();
						//put some code here to freeze enemies
					}
					break;*/
				case pKey:
					event.preventDefault();
					if (gameStatus != "paused") {
						pause();
					} else {
						unpause();
					}
					break;
			}
		}
	});
	$("body").keyup(function(event) {
		if (keysPressed.indexOf(event.keyCode) != -1) {
			event.preventDefault();
			keysPressed.splice(keysPressed.indexOf(event.keyCode), 1);
		} else if (event.keyCode == spaceBar && player && player.primaryWeaponFiring == 'ws') {
			player.primaryWeaponFiring = '';
		}
	});
}