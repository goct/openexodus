function w(x, y, direction) {
	this.name = "w";
	this.x = x;
	this.y = y;
	this.width = tileSize * 0.8;
	this.height = tileSize * 0.8;
	this.speed = 1000;
	this.damage = 3;
	this.direction = direction;
	this.animated = false;
	this.finalLoop = false;
	this.toRemove = false;
	this.emanationPoint = [5, 6];
	this.collisionOffsetX = 0;
	this.collisionOffsetY = 0;
	this.sprite = new Sprite('images/w.png', [0, 0], [this.width, this.height], 0, [0]);
}