var game;
window.onload = function () {
	var gameConfig = {
		width:                  900,
		height:                 900,
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
		for( var i = 0; i < 4; i++ ) {
			for( var j = 0; j < 4; j++ ) {
				this.add.image( 120 + j * 220, 120 + i * 220, "emptytile" );
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