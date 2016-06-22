var totalScore = 0;
var timerSeconds = 30;

// -- game type button events --
function enableNumberGameButton() {
	$("#wordButton").prop("disabled", false);
	$("#numberButton").prop("disabled", true);
	showNumberGame();
}

function enableWordGameButton() {
	$("#wordButton").prop("disabled", true);
	$("#numberButton").prop("disabled", false);
	showWordGame();
}

$(document).ready(function(){
	$("button.gameType").on("click", function() {
		var buttonId = $(this).attr("id");
		var func;
		if (buttonId == "wordButton") {
			func = function() { enableWordGameButton(); };
		} else if (buttonId == "numberButton") {
			func = function() { enableNumberGameButton(); };
		} else {
			console.log("Invalid button ID found in toggleGameType: " + buttonId);
			return;
		}
		
		func();
	});
});


// -- show the game types --
function showWordGame() {
	showGameType($("#wordGameDiv"), $("#numberGameDiv"));
}
function showNumberGame() {
	showGameType($("#numberGameDiv"), $("#wordGameDiv"));
}

function showGameType($showDiv, $hideDiv) {
	$("#starterText").hide();
	
	if ($showDiv.contents().length == 0) {
		generateGameTypeContent($showDiv);
	}
	
	$showDiv.show();
	$hideDiv.hide();
}


// -- generate content for the game types --
function generateGameTypeContent($gameDiv) {
	var divId = $gameDiv.attr("id");
	var func;
	if (divId == "wordGameDiv") {
		func = function() { generateWordGameContent(); };
	} else if (divId == "numberGameDiv") {
		func = function() { generateNumberGameContent(); };
	} else {
		console.log("Invalid div ID found in generateGameTypeContent: " + divId);
		return;
	}
	
	func();
}


// this is used by the number game and the word game
function getRandomNumber(min, max) {
	return Math.floor(Math.random() * max) + min;
}























