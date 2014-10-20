function checkCollisions() {
	$.each(enemies, function(index, enemy) {
		if (boxCollides([enemy.x + enemy.collisionOffsetX, enemy.y + enemy.collisionOffsetY], [enemy.width, enemy.height], [player.x, player.y], [player.width, player.height])) {
			//player has collided with an enemy
			if (enablePlayerCollision) {
				gameStatus = "player dead";
				/*
				console.log('enemy coordinates are ' + enemy.x + enemy.collisionOffsetX + ', ' + (enemy.y + enemy.collisionOffsetY));
				console.log('enemy.collisionOffsetY = ' + enemy.collisionOffsetY);
				console.log('enemy.y is ' + enemy.y);
				console.log('enemy height is ' + (enemy.height - enemy.collisionOffsetY));
				console.log('player coordinates are ' + player.x + ', ' + player.y);
				console.log('player height is ' + player.height);
				alert('you got hit by an enemy ' + enemy.name);
				*/
				return false;
			}
		}
		//check if players projectiles are colliding with enemies
		$.each([friendlyProjectiles], function(index, projectileList) {
			$.each(projectileList, function(index, projectile) {
				if (projectile.finalLoop == false 
					&& boxCollides(
						[
							projectile.x + projectile.collisionOffsetX,
							projectile.y + projectile.collisionOffsetY
						], 
						[
							projectile.width, projectile.height
						], 
						[
							enemy.x + enemy.collisionOffsetX, 
							enemy.y + enemy.collisionOffsetY
						], 
						[enemy.width, enemy.height]
					)) {
					//enemy has been hit by a players projectile
					projectile.finalLoop = true;
					projectile.impact = true;
					enemy.health -= projectile.damage;
					if (enemy.health <= 0) {
						switch(enemy.name) {
							case "magician":
								score += 50;
								//create a death animation sprite where magician is
								//play a death sound here
								break;
						}
						scoreDisplay.html(score);
						if (score > highScore && highScore > 0) {
							highScore = score;
							highScoreDisplay.html(highScore);
						}
						enemy.toRemove = true;
						cleanUpNeeded = true;
					}
				}
			});
		});
	});
	/*$.each(enemyBullets, function(index, enemyBullet) {
		if (boxCollides([player.x, player.y], player.sprite.size, [enemyBullet.x + enemyBullet.collisionOffsetX, enemyBullet.y + enemyBullet.collisionOffsetY], [enemyBullet.width, enemyBullet.height])) {
			//player has been hit by an enemy bullet
			if (enablePlayerCollision) {
				gameOver = true;
				return false;
				enemyBullet.toRemove = true;
				cleanUpNeeded = true;
			}
		}
	});*/
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

function adjustActorMovement(oldX, oldY, newX, newY, actor) {
	var tilesInY = newY / tileSize;
	var tilesInX = newX / tileSize;
	var rowsIn = [Math.floor(tilesInY), Math.ceil(tilesInY)];
	var colsIn = [Math.floor(tilesInX), Math.ceil(tilesInX)];

	actor.newTilesIn = [];
	var updateMap = false;

	//generate tiles the actor is now in
	$.each(rowsIn, function(index, rowIn) {
	    $.each(colsIn, function(index, colIn) {
	    	var alreadyExists = false;
	        $.each(actor.newTilesIn, function(index, newTilesInnerArray) {
	            for (var i in newTilesInnerArray) {
	                if (newTilesInnerArray[0] === rowIn && newTilesInnerArray[1] === colIn) {
	                	alreadyExists = true;
	                	return false;
	                }
	            }
	        });
	        if (!alreadyExists) {
	            actor.newTilesIn.push([rowIn, colIn]);
	            console.log("update1");
	            updateMap = true;
	        }
	        
	    });
	});
	/*//========
	console.log("---");
	for (var i in actor.newTilesIn) {
		console.log("actor is now in " + actor.newTilesIn[i]);
	}
	console.log("actor.oldTilesIn is " + actor.oldTilesIn);
	console.log("---");
	//========*/
	
	//find out what tiles the actor is no longer in
	var tilesNoLongerIn = [];
	//iterate through all old tiles
	for (var i in actor.oldTilesIn) {
		var oldTileInRow = actor.oldTilesIn[i][0];
		var oldTileInCol = actor.oldTilesIn[i][1];
		var stillInIt = false;
		//iterate through all new tiles
		for (var j in actor.newTilesIn) {
			var newTileInRow = actor.newTilesIn[j][0];
			var newTileInCol = actor.newTilesIn[j][1];
			if (oldTileInRow == newTileInRow && oldTileInCol == newTileInCol) {
				stillInIt = true;
				break;
			}
		}
		if (!stillInIt) {
			//console.log("no longer in " + actor.oldTilesIn[i]);
			tilesNoLongerIn.push(actor.oldTilesIn[i]);
			console.log("update2");
			updateMap = true;
		}
	}

	actor.oldTilesIn = actor.newTilesIn;
	if (updateMap) {
		console.log("updating map");
		$.each(actor.newTilesIn, function(index, newTileIn) {
			var newTileInRow = newTileIn[0];
			var newTileInCol = newTileIn[1];
			var tileStack = levels[level]["row" + newTileInRow][newTileInCol];
			if (tileStack.indexOf("player location") === -1) {
				tileStack.unshift("player location");
			}
		});
		$.each(tilesNoLongerIn, function(index, tileNotIn) {
			var tileNotInRow = tileNotIn[0];
			var tileNotInCol = tileNotIn[1];
			var tileStack = levels[level]["row" + tileNotInRow][tileNotInCol];
			tileStack.splice(tileStack.indexOf("player location"), 1);
		});
		generateLevelTiles(level);
	}


/*

			for (var k in newTileIn) {
				if (oldTileIn[k] !== newTileIn[k]) {
					tilesNoLongerIn.push(needle);
					alert("we are no longer in tile " + needle);
					continue;
				}
			}
		}
	};*/

	//actor.oldTilesIn = actor.newTilesIn;

	//console.log("tiles no longer in is " + tilesNoLongerIn);
	//console.log("down here");

	/*
	var alreadyInTile = false;
	$.each(rowsIn, function(index, rowIn) {
		$.each(colsIn, function(index, colIn) {
			$.each(actor.oldTilesIn, function(index, tileIn) {
				var existingCol = tileIn[0];
				var existingRow = tileIn[1];
				if (existingCol == colIn && existingRow == rowIn) {
					//this tile is already on the list
					alreadyInTile = true;
					console.log("we were already in the tile " + existingCol + "," + existingRow);
					return false;
				}
			})
			if (!alreadyInTile) {
				actor.newTilesIn.push([colIn, rowIn]);
				console.log("adding col " + colIn + ", row " + rowIn);
				console.log("old tiles in is " + actor.oldTilesIn);
				console.log("new tiles in is " + actor.newTilesIn);
			}
			alreadyInTile = false;
		});
	});
	var newXTiles = [];
	var newYTiles = [];*/
	



	/*$.each(actor.newTilesIn, function(index, tileCoords) {
		if (actor.oldTilesIn.indexOf(tileCoords) === -1) {
			console.log("in a new tile");
			//this is a tile we weren't in before
			if (actor.oldTilesIn.indexOf([tileCoords[0] - 1, tileCoords[1]]) !== -1
				|| actor.oldTilesIn.indexOf([tileCoords[0] + 1, tileCoords[1]]) !== -1
				) {
				//we moved on the x axis to get to this new tile
				newXTiles.push(tileCoords);
			}
			//not else if because can move diagonally into a new tile
			if (actor.oldTilesIn.indexOf([tileCoords[0], tileCoords[1] - 1]) !== -1
				|| actor.oldTilesIn.indexOf([tileCoords[0], tileCoords[1] + 1]) !== -1
				) {
				//we moved on the y axis to get to this new tile
				newYTiles.push(tileCoords);
			}
		}
	});

	//check if new tiles entered contain collision objects
	//if so, cancel the players movement to them
	$.each(newXTiles, function(index, coords) {
		if (levels[level][coords[1]][coords[0]][0] == "brick") {
			console.log("resetting x");
			actor.x = actor.lastValidPosition[0];
		}
	});
	$.each(newYTiles, function(index, coords) {
		console.log(coords);
		if (levels[level][coords[1]][coords[0]][0] == "brick") {
			console.log("resetting y");
			actor.y = actor.lastValidPosition[1];
		}
	});*/
}