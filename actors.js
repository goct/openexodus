function moses(x, y) {
	//dimensions
	this.width = 100;
	this.height = 100;
	this.gunPort = [0, 0];

	//start location
	this.x = x;
	this.y = y;
	this.direction1;
	this.direction2;
	this.facingDirection = "right";

	//movement
	this.manualSpeed = 500;
	this.lastValidPosition = [x, y];

	//weapons
	this.wFireRate = 100 //ms per shot
	this.lastFiredWs = this.wFireRate;
	this.currentExistingWs = 0;
	this.maxExistingWsAllowed = 300;
	this.primaryWeaponFiring = "";
	this.secondaryWeaponFiring = "";

	//admin
	this.name = "moses";
	this.toRemove = false;
	this.oldTilesIn = [[0, 0]];
	this.newTilesIn = [];
	this.sprite = new Sprite("images/moses.png", [0, 0], [this.width, this.height], 0, [0]);
}

moses.prototype.move = function(keyPressed1, keyPressed2, secSinceLastUpdate) {
	//input keycodes
	var leftArrowKey = 37;
	var upArrowKey = 38;
	var rightArrowKey = 39;
	var downArrowKey = 40;

	var entityObj = this;
	var topBoundary = 0;
	var rightBoundary = tileSize * levels[level]["width"];// - this.width;
	var bottomBoundary = tileSize * levels[level]["height"];// - this.height;
	var leftBoundary = 0;
	this.lastValidPosition = [this.x, this.y];

	//alter character direction
	if (keyPressed1 == leftArrowKey || keyPressed2 == leftArrowKey) {
		this.facingDirection = "left";
	} else if (keyPressed1 == rightArrowKey || keyPressed2 == rightArrowKey) {
		this.facingDirection = "right";
	} else if (keyPressed1 == upArrowKey || keyPressed2 == upArrowKey) {
		this.facingDirection = "up";
	} else if (keyPressed1 == downArrowKey || keyPressed2 == downArrowKey) {
		this.facingDirection = "down";
	}
	$.each([keyPressed1, keyPressed2], function(index, keyPressed) {
		if (keyPressed !== undefined) {
			switch(keyPressed) {
				//each case will move the entity's coords if they don't put him off screen
				case leftArrowKey:
					if (entityObj.x - (entityObj.manualSpeed * secSinceLastUpdate) >= leftBoundary) {
						entityObj.x -= (entityObj.manualSpeed * secSinceLastUpdate);
					} else {
						entityObj.x = 0;
					}
					break;
				case rightArrowKey:
					if (entityObj.x + (entityObj.manualSpeed * secSinceLastUpdate) + entityObj.width <= rightBoundary) {
						entityObj.x += (entityObj.manualSpeed * secSinceLastUpdate);
					} else {
						entityObj.x = rightBoundary - entityObj.width;
					}
					break;
				case upArrowKey:
					if (entityObj.y - (entityObj.manualSpeed * secSinceLastUpdate) >= topBoundary) {
						entityObj.y -= (entityObj.manualSpeed * secSinceLastUpdate);
					} else {
						entityObj.y = topBoundary;
					}
					break;
				case downArrowKey:
					if (entityObj.y + (entityObj.manualSpeed * secSinceLastUpdate) + entityObj.height <= bottomBoundary) {
						entityObj.y += (entityObj.manualSpeed * secSinceLastUpdate);
					} else {
						entityObj.y = bottomBoundary - entityObj.height;
					}
					break;
			}
		}
	});
	//console.log(entityObj.x, entityObj.y);
	adjustActorMovement(entityObj.lastValidPosition[0], entityObj.lastValidPosition[1], 
						entityObj.x, entityObj.y, entityObj
						);
}

function magician(x, y) {
	//dimensions
	this.width = 100;
	this.height = 100;
	this.collisionOffsetX = 0;
	this.collisionOffsetY = 0;

	//start location
	this.x = x;
	this.y = y;

	//health
	this.maxHealth = 30;
	this.health = 30;

	//movement
	this.speed = 300;
	this.damagedSpeed = 700;

	//weapons

	//admin
	this.name = "magician";
	this.animated = true;
	this.toRemove = false;
	this.sprite = new Sprite("images/magician", [0, 0], [this.width, this.height], 0, [0]);

	this.name = "magician";
	this.x = parseInt(x);
	this.y = parseInt(y);
	this.width = 100;
	this.height = 100;
}