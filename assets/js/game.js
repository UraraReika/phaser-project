var game,
	gameOptions = {
		tileSize: 	      200,
		tileSpacing:      20,
		boardSize:        {
			rows: 4,
			cols: 4
		},
		tweenSpeed:       200,
		swipeMaxTime:     1000,
		swipeMinDistance: 20,
		swipeMinNormal:   0.85
	};

const LEFT  = 0;
const RIGHT = 1;
const UP    = 2;
const DOWN  = 3;

window.onload = function () {
	var gameConfig = {
		width:                  gameOptions.boardSize.cols * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
		height:                 gameOptions.boardSize.rows * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
		backgroundColor:        0xecf0f1,
		scene:                  [ bootGame, playGame ]
	};
	
	game = new Phaser.Game(gameConfig);
	window.focus();
	resizeGame();
	window.addEventListener("resize", resizeGame);
};

class bootGame extends Phaser.Scene {
	constructor() {
		super( "BootGame" );
	}
	preload() {
		this.load.image( "emptytile", "assets/images/emptytile.png" );
		this.load.spritesheet( "tiles", "assets/images/tiles.png", {
			frameWidth:  gameOptions.tileSize,
			frameHeight: gameOptions.tileSize
		} );
	}
	create() {
		console.log( "Game is booting..." );
		this.scene.start( "PlayGame" );
	}
}

class playGame extends Phaser.Scene {
	constructor() {
		super( "PlayGame" );
	}
	create() {
		this.canMove = false;
		this.boardArray = [];
		
		console.log( "This is my awesome game." );
		for( var i = 0; i < gameOptions.boardSize.rows; i++ ) {
			this.boardArray[i] = [];
			for( var j = 0; j < gameOptions.boardSize.cols; j++ ) {
				var tilePosition = this.getTilePosition(i, j);
				this.add.image( tilePosition.x, tilePosition.y, "emptytile" );
				var tile = this.add.sprite( tilePosition.x, tilePosition.y, "tiles", 0 );
				tile.visible = false;
				this.boardArray[i][j] = {
					tileValue:  0,
					tileSprite: tile
				}
			}
		}
		
		this.addTile();
		this.addTile();
		
		this.input.keyboard.on('keydown', this.handleKey, this);
		this.input.on('pointerup', this.handleSwipe, this);
	}

	addTile() {
		var emptyTiles = [];
		for (var i = 0; i < gameOptions.boardSize.rows; i++) {
			for (var j = 0; j < gameOptions.boardSize.cols; j++) {
				if (this.boardArray[i][j].tileValue == 0) {
					emptyTiles.push({
						row: i,
						col: j
					})
				}
			}
		}
		if (emptyTiles.length > 0) {
			var chosenTile = Phaser.Utils.Array.GetRandom(emptyTiles);
			
			this.boardArray[chosenTile.row][chosenTile.col].tileValue = 1;
			this.boardArray[chosenTile.row][chosenTile.col].tileSprite.visible = true;
			this.boardArray[chosenTile.row][chosenTile.col].tileSprite.setFrame(0);
			this.boardArray[chosenTile.row][chosenTile.col].tileSprite.alpha = 0;
			this.tweens.add({
				targets: [this.boardArray[chosenTile.row][chosenTile.col].tileSprite],
				alpha: 1,
				duration: gameOptions.tweenSpeed,
				callbackScope: this,
				onComplete: function () {
					console.log('tween completed');
					this.canMove = true;
				}
			});
		}
	}

	getTilePosition(row, col) {
		var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5),
		    posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);

		return new Phaser.Geom.Point(posX, posY);
	}
	
	handleKey(e) {
		if (this.canMove) {
			switch (e.code) {
				case 'KeyA':
				case 'ArrowLeft':
					this.makeMove(LEFT);
					break;
				case 'KeyD':
				case 'ArrowRight':
					this.makeMove(RIGHT);
					break;
				case 'KeyW':
				case 'ArrowUp':
					this.makeMove(UP);
					break;
				case 'KeyS':
				case 'ArrowDown':
					this.makeMove(DOWN);
					break;
			}
		}
	}
	
	handleSwipe(e) {
		if (this.canMove) {
			var swipeTime = e.upTime - e.downTime,
				fastEnough = swipeTime < gameOptions.swipeMaxTime,
				swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY),
				swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe),
				longEnough = swipeMagnitude > gameOptions.swipeMinDistance;
		}
		
		if (longEnough && fastEnough) {
			Phaser.Geom.Point.SetMagnitude(swipe, 1);
			if (swipe.x > gameOptions.swipeMinNormal) {
				this.makeMove(RIGHT);
			}
			if (swipe.x < -gameOptions.swipeMinNormal) {
				this.makeMove(LEFT);
			}
			if (swipe.y > gameOptions.swipeMinNormal) {
				this.makeMove(DOWN);
			}
			if (swipe.y < -gameOptions.swipeMinNormal) {
				this.makeMove(UP);
			}
		}
	}
	
	makeMove(d) {
		var dRow = (d === LEFT || d === RIGHT) ? 0 : d === UP ? -1 : 1,
			dCol = (d === UP || d === DOWN) ? 0 : d === LEFT ? -1 : 1;

		this.canMove = false;

		for (var i = 0; i < gameOptions.boardSize.rows; i++) {
			for (var j = 0; j < gameOptions.boardSize.cols; j++) {
				var curRow = dRow === 1 ? (gameOptions.boardSize.rows - 1) - i : i,
					curCol = dCol === 1 ? (gameOptions.boardSize.cols - 1) - j : j,
					tileValue = this.boardArray[curRow][curCol].tileValue;

				if (tileValue !== 0) {
					var newPos = this.getTilePosition(curRow + dRow, curCol + dCol);

					this.boardArray[curRow][curCol].tileSprite.x = newPos.x;
					this.boardArray[curRow][curCol].tileSprite.y = newPos.y;
				}
			}
		}
	}

}

function resizeGame() {
	var canvas                  = document.querySelector("canvas"),
		windowWidth             = window.innerWidth,
		windowHeight            = window.innerHeight,
		windowRatio             = windowWidth / windowHeight,
		gameRatio               = game.config.width / game.config.height;
	
	if(windowRatio < gameRatio) {
		canvas.style.width = windowWidth + "px";
		canvas.style.height = (windowWidth / gameRatio) + "px";
	} else {
		canvas.style.width = (windowHeight * gameRatio) + "px";
		canvas.style.height = windowHeight + "px";
	}
}