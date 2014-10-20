function blankTile(x, y) {
	//dimensions
	this.width = tileSize;
	this.height = tileSize;

	//start location
	this.x = x;
	this.y = y;

	//admin
	this.name = "blank tile";
	this.toRemove = false;
	this.sprite = new Sprite("images/blankTile.png", [0, 0], [this.width, this.height], 0, [0]);
}

function brickTile(x, y) {
	//dimensions
	this.width = tileSize;
	this.height = tileSize;

	//start location
	this.x = x;
	this.y = y;

	//admin
	this.name = "brick tile";
	this.toRemove = false;
	this.sprite = new Sprite("images/brick.png", [0, 0], [this.width, this.height], 0, [0]);	
}

function playerLocation(x, y) {
	//dimensions
	this.width = tileSize;
	this.height = tileSize;

	//start location
	this.x = x;
	this.y = y;

	//admin
	this.name = "player location";
	this.toRemove = false;
	this.sprite = new Sprite("images/playerLocation.png", [0, 0], [this.width, this.height], 0, [0]);
}