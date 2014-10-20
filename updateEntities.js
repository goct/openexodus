function updateEntities(secSinceLastUpdate, gameStatus) {
	if (gameStatus == "game over") {
		return;
	}

	/*##################
	        UPDATE PLAYER
	##################*/
	/*//change plane sprite as needed
	if (keysPressed.indexOf(upArrowKey) == -1 && keysPressed.indexOf(downArrowKey) == -1) {
		//plane should be stable
		if (player.sprite.url != 'images/plane-stable.png') {
			player.sprite.url = 'images/plane-stable.png';
			player.sprite.size[0] = 61;
			player.sprite.size[1] = 16;
			player.height = 16;
		}
	} else if (keysPressed.indexOf(upArrowKey) != -1) {
		//plane should be moving up
		if (player.sprite.url != 'images/plane-up.png') {
			player.sprite.url = 'images/plane-up.png';
			player.sprite.size[0] = 61;
			player.sprite.size[1] = 16;
			player.height = 16;
		}
	} else if (keysPressed.indexOf(downArrowKey) != -1) {
		//plane should be moving down
		if (player.sprite.url != 'images/plane-down.png') {
			player.sprite.url = 'images/plane-down.png';
			player.sprite.size[0] = 60;
			player.sprite.size[1] = 17;
			player.height = 16;
		}
	}
	*/
	if (player.primaryWeaponFiring) {
		var now = Date.now();
		switch(player.primaryWeaponFiring) {
			case "ws":
				var timeSinceLastFiredWs = (now - player.lastFiredWs);
				if (timeSinceLastFiredWs >= player.wFireRate) {
					player.lastFiredWs = Date.now();
					if (player.currentExistingWs < player.maxExistingWsAllowed) {
						player.currentExistingWs++;
						friendlyProjectiles.push(new w(
													player.x + player.gunPort[0] + 5,
													player.y + player.gunPort[1] - 7,
													player.direction
												));	
					}
					//play a projectile firing sound here
				}
				break;
		}
	}
	
	/*if (player.secondaryWeaponFiring) {
		var now = Date.now();
		switch(player.secondaryWeaponFiring) {
			case 'bombs':
				var timeSinceLastFiredBombs = (now - player.lastFiredBombs);
				if (timeSinceLastFiredBombs >= player.bombFireRate) {
					player.lastFiredBombs = Date.now();
					bombs.push(new playerBomb(player.x + 20, player.y + 7));
				}
				break;
			case 'homing missiles':
				var timeSinceLastFiredHomingMissiles = (now - player.lastFiredHomingMissiles);
				if (timeSinceLastFiredHomingMissiles >= player.homingMissileFireRate) {
					if (enemies.length) {
						//pick a random enemy target
						var target = enemies[Math.floor(Math.random() * enemies.length)];
					} else {
						var target = null;
					}
					player.lastFiredHomingMissiles = Date.now();
					homingMissiles.push(new playerHomingMissile(player.x + player.gunPort[0] -20, player.y + player.gunPort[1] - 10, target));
					homingMissiles[homingMissiles.length - 1].sound = homingMissileSound;
					homingMissiles[homingMissiles.length - 1].sound.play();
				}
				break;
		}		
	}*/
	
	if (keysPressed[0] !== undefined) {
		player.move(keysPressed[0], keysPressed[1], secSinceLastUpdate);
	}
	/*
	//find out if player.newTilesIn is identical to player.oldTilesIn
	var identical = true;
	for (var i = 0; i < player.newTilesIn.length; i++) {
		if (i >= player.oldTilesIn.length) {
			identical = false;
			break;
		}
		var newTileInCol = player.newTilesIn[i][0];
		var newTileInRow = player.newTilesIn[i][1];
		var oldTileInCol = player.oldTilesIn[i][0];
		var oldTileInRow = player.oldTilesIn[i][1];
		if (newTileInCol != oldTileInCol || newTileInRow != oldTileInRow) {
			identical = false;
			break;
		}
	}
	if (!identical) {
		//remove player location from old tiles
		$.each(player.oldTilesIn, function(index, tileCoords) {
			if (levels[level]["row" + tileCoords[1]][tileCoords[0]][0] == "player location") {
				levels[level]["row" + tileCoords[1]][tileCoords[0]].splice(0, 1);
			}
		});
		//add player location to new tiles
		$.each(player.newTilesIn, function(index, tileCoords) {
			if (levels[level]["row" + tileCoords[1]][tileCoords[0]][0] != "player location") {
				levels[level]["row" + tileCoords[1]][tileCoords[0]].unshift("player location");
			}
		});
		tiles = [];
		generateLevelTiles(level);
		player.oldTilesIn = player.newTilesIn;
	}*/
	
	/*################
	UPDATE EXPLOSIONS
	################*/
	for (var i = 0; i < explosions.length; i++) {
		explosions[i].sprite.update(secSinceLastUpdate);
		if (explosions[i].sprite.done) {
			explosions[i].toRemove = true;
			cleanUpNeeded = true;
		}
	}
	/*###############
	UPDATE ENEMIES
	###############*/
	$.each(enemies, function(index, enemy) {
		//change redplane sprite to damaged version if low health
		if (enemy.sprite.url == 'images/redplane.png' && enemy.health <= enemy.maxHealth / 2) {
			enemy.sprite.url = 'images/redplane-damaged.png';
			enemy.sprite.size[0] = 106;
			enemy.sprite.size[1] = 26;
			enemy.width = enemy.damagedWidth;
			enemy.height = enemy.damagedHeight;
			enemy.y += 3;
		}
		//update animated sprites
		if (enemy.animated) {
			enemy.sprite.update(secSinceLastUpdate);
		}
		//move enemies
		if (enableEnemyMovement) {
			switch(enemy.name) {
				case 'bugship':
				case 'redplane':
				case 'helicopter':
					enemy.x -= (enemy.speed * secSinceLastUpdate);
					break;
				case 'aagun':
					enemy.x -= (landscapes[0].speed * secSinceLastUpdate);
					break;
			}
			
		}
		//make enemies shoot at the player
		enemy.lastFired += secSinceLastUpdate;
		//if (enableEnemies) {
			if (enemy.lastFired >= enemy.fireRate && enemy.x < WIDTH - enemy.width) {
				switch(enemy.name) {
					case 'bugship':
					case 'redplane':
					case 'helicopter':
					case 'aagun':
						//find angle to fire bullet at player
						var relativePositionX = (enemy.x + 22 - player.x);
						var relativePositionY = (enemy.y + 18 - player.y);
						var radians = Math.atan2(-relativePositionY, relativePositionX);
						enemyBullets.push(new enemyRegularLaser(enemy.x + 22, enemy.y + 18, radians));
						break;
					/*
					case 'aagun':
						//this projectile will update trajectory when it moves
						enemyBullets.push(new enemyHomingMissile(enemy.x, enemy.y));
						break;
					*/
				}

				enemy.lastFired = 0;
			}
		//}
		//remove enemy if offscreen
		if (enemy.x < enemy.width * -1) {
			$.each(homingMissiles, function(index, homingMissile) {
				if (homingMissile.target === enemy) {
					homingMissile.target = null;
				}
			});
			enemy.toRemove = true;
			cleanUpNeeded = true;
		}
	});
	/*
	//add enemies
	if (enableEnemies == true) {
		if (enemyWaves.length == 0) {
			//we've run out of pre-planned enemy waves, so just add random enemies
				if (secSinceLastEnemySpawn >= enemySpawnRate) {
					var enemyY = getRandomInt(0, HEIGHT - 37 - 150);
					var randomFloat = Math.random();
					if (randomFloat > 0.8) {
						enemies.push(new redPlane(WIDTH, enemyY));
					} else if (randomFloat > 0.6) {
						enemies.push(new bugShip(WIDTH, enemyY));
					} else if (randomFloat > 0.5) {
						enemies.push(new aaGun(WIDTH, HEIGHT - 111 - 15));
					} else if (randomFloat > 0.4) {
						enemies.push(new helicopter(WIDTH, enemyY));
					} else {
						//add a randomly generated enemy wave
						var quantity = getRandomInt(1, 6);
						if (Math.random() > 0.5) {
							var orientation = 'h';
						} else {
							var orientation = 'v';
						}
						var randomFloat = Math.random();
						if (randomFloat > 0.9) {
							var enemyType = 'redplane';
						} else if (randomFloat > 0.8) {
							var enemyType = 'helicopter';
						} else {
							var enemyType = 'bugship';
						}
						enemyWaves.push(new enemyWave(elapsedSeconds, enemyType, quantity, 2, getRandomInt(50, 500), orientation));
					}
					secSinceLastEnemySpawn = 0;
				} else {
					secSinceLastEnemySpawn += secSinceLastUpdate;
				}
		} else {
			//add pre-planned enemy waves
			for (var i = 0; enemyWaves[i] !== undefined; i++) {
				var wave = enemyWaves[i];
				if (elapsedSeconds >= wave.spawnTime) {
					switch(wave.enemyType) {
						case 'bugship':
							var enemy = bugShip;
							var entityWidth = 35;
							var entityHeight = 37;
							break;
						case 'redplane':
							var enemy = redPlane;
							var entityWidth = 107;
							var entityHeight = 30;
							break;
						case 'aagun':
							var enemy = aaGun;
							var entityWidth = 117;
							var entityHeight = 111;
							break;
						case 'helicopter':
							var enemy = helicopter;
							var entityWidth = 145;
							var entityHeight = 55;
							break;
					}
					for (var j = 0; j < wave.quantity; j++) {
						switch(wave.orientation) {
							case 'h':
								//left to right
								enemies.push(new enemy(entityWidth + WIDTH + wave.spacing * entityWidth * j, wave.y));
								break;
							case 'v':
								//going down vertically
								enemies.push(new enemy(entityWidth + WIDTH, wave.y + (wave.spacing * j * entityHeight)));
								break;
						}
					}
					enemyWaves.splice(i, 1);
					i--;
				} else {
					//stop looping through all possible spawns
					break;
				}
			}
		}
	}

	*/
	//#################
	//UPDATE PLAYERS Ws
	//#################
	$.each(friendlyProjectiles, function(index, projectile) {
		switch(projectile.name) {
			case "w":
				//check if it's offscreen
				if (projectile.direction == "up" && projectile.y < (0 - projectile.height)) {
					projectile.toRemove = true;
				} else if (projectile.direction == "down" && projectile.y > HEIGHT) {
					projectile.toRemove = true;
				} else if (projectile.direction == "left" && projectile.x < (0 - projectile.width)) {
					projectile.toRemove = true;
				} else if (projectile.direction == "right" && projectile.x > WIDTH) {
					projectile.toRemove = true;
				} else {
					//it's not offscreen, so lets move it
					switch(projectile.direction) {
						case "up":
							projectile.y -= projectile.speed * secSinceLastUpdate;
							break;
						case "down":
							projectile.y += projectile.speed * secSinceLastUpdate;
							break;
						case "left":
							projectile.x -= projectile.speed * secSinceLastUpdate;
							break;
						case "right":
							projectile.x += projectile.speed * secSinceLastUpdate;
							break;
						default:
							console.log("the direction is " + projectile.direction);
							break;
					}
				}
				if (projectile.finalLoop) {
					projectile.toRemove = true;
				}
				if (projectile.toRemove == true) {
					cleanUpNeeded = true;
				}
				/*w.x += w.speed * secSinceLastUpdate;
				if (w.x > WIDTH || w.finalLoop) {
					w.toRemove = true;
					cleanUpNeeded = true;
				}*/					
				break;
		}
	});
	
	
	/*#################
	UPDATE ENEMY BULLETS
	#################*/
	/*$.each(enemyBullets, function(index, enemyBullet) {
		switch(enemyBullet.name) {
			case 'orb-red':
				enemyBullet.x -= enemyBullet.speed * Math.cos(enemyBullet.radians) * secSinceLastUpdate;
				enemyBullet.y += enemyBullet.speed * Math.sin(enemyBullet.radians) * secSinceLastUpdate;
				break;
		}
		if (enemyBullet.x <= enemyBullet.width * -1 || enemyBullet.x > WIDTH || enemyBullet.y < 0 - 1 || enemyBullet.y > HEIGHT) {
			enemyBullet.toRemove = true;
			cleanUpNeeded = true;
		}
	});*/
	
	/*###################
	UPDATE BACKGROUND IMAGE
	###################*/
	/*$.each(backgroundImages, function(index, backgroundImage) {
		backgroundImage.x -= backgroundImage.speed * secSinceLastUpdate;
		if (backgroundImage.x < (backgroundImage.width / 2) * -1) {
			if (backgroundImages.length == 1) {
				backgroundImages.push(new backgroundStars(backgroundImage.x + backgroundImage.width, 0));
			}
			if (backgroundImage.x < backgroundImage.width * -1) {
				backgroundImage.toRemove = true;
				cleanUpNeeded = true;
			}
		}
	});*/
}

function cleanUp() {
	$.each([enemies, explosions, friendlyProjectiles], function(index, objectList) {
		for (var i = 0; i < objectList.length; i++) {
			if (objectList[i].toRemove == true) {
				if (objectList[i].name == "w") {
					player.currentExistingWs--;
				}
				objectList.splice([i], 1);
				i--;
			}
		}		
	});
	cleanUpNeeded = false;
}