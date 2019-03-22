var game;
window.onload = function () {
	var gameConfig = {
		width:                  480,
		height:                 640,
		backgroundColor:        0xff0000
	};
	
	game = new Phaser.Game(gameConfig);
	window.focus();
	resizeGame();
	window.addEventListener("resize", resizeGame);
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