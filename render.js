function render() {
	clear();
	//render foreground canvas stuff

	$.each([tiles, enemies, friendlyProjectiles, explosions], function(index, objList) {
		$.each(objList, function(index, object) {
			object.sprite.render(ctx, object.x, object.y);
		});
	});
	if (player) {
		player.sprite.render(ctx, player.x, player.y);
	}
	
	/*//render background canvas stuff
	$.each([backgroundImages, landscapes], function(index, objList) {
		$.each(objList, function(index, object) {
			object.sprite.render(bgCtx, object.x, object.y);
		});
	});*/
	
}

function clear() {
	ctx.clearRect(0, 0, WIDTH, HEIGHT);
	bgCtx.clearRect(0, 0, WIDTH, HEIGHT);
}

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
                    pos[0] + size[0], pos[1] + size[1],
                    pos2[0], pos2[1],
                    pos2[0] + size2[0], pos2[1] + size2[1]);
}