var game,
	gameOptions = {
		tileSize: 	 200,
		tileSpacing: 20,
		boardSize: 	 {
			rows: 4,
			cols: 4
		}
	}
window.onload = function () {
	var gameConfig = {
		width:                  gameOptions.boardSize.cols * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
		height:                 gameOptions.boardSize.rows * (gameOptions.tileSize + gameOptions.tileSpacing) + gameOptions.tileSpacing,
		backgroundColor:        0xecf0f1,
		scene: [ bootGame, playGame ]
	};
	
	game = new Phaser.Game(gameConfig);
	window.focus();
	resizeGame();
	window.addEventListener("resize", resizeGame);
}

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
		console.log( "This is my awesome game." );
		for( var i = 0; i < gameOptions.boardSize.rows; i++ ) {
			for( var j = 0; j < gameOptions.boardSize.cols; j++ ) {
				var tilePosition = this.getTilePosition(i, j);
				this.add.image( tilePosition.x, tilePosition.y, "emptytile" );
				this.add.sprite( tilePosition.x, tilePosition.y, "tiles", 0 );
			}
		}
	}
	getTilePosition(row, col) {
		var posX = gameOptions.tileSpacing * (col + 1) + gameOptions.tileSize * (col + 0.5),
		    posY = gameOptions.tileSpacing * (row + 1) + gameOptions.tileSize * (row + 0.5);

		return new Phaser.Geom.Point(posX, posY);
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