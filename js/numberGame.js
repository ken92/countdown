var largeNumberSet = [25, 50, 75, 100];
var smallNumberSet = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10];

function generateNumberGameContent() {
	// TODO: add instructions for how to play
	// http://datagenetics.com/blog/august32014/index.html
	startNewNumberGame();
}

function startNewNumberGame() {
	var $container = $("#numberGameDiv");
	$container.empty();
	
	var $numberTileDiv = $("<div id='numberTiles'></div>");
	$container.append($numberTileDiv);
	$container.append("<span id='numberInstruction' style='display: block;'>Choose six tiles</span>");
	
	{
		var chosenIndexesMap = {};
		var min = 0;
		var max = largeNumberSet.length + smallNumberSet.length;
		for (var i=0; i<max; i++) {
			var index = getRandomNumber(min, max);
			while (chosenIndexesMap[index] != undefined) {
				index = getRandomNumber(min, max);
			}
			// the value for each tile is determined by the index of the value rather than the value itself; this is a simple way to prevent users from cheating by inspecting the page
			$numberTileDiv.append("<button class='card' value='" + index + "'></button>");
			chosenIndexesMap[index] = index;
		}
	}
	
	$container.append("<button id='okNumberButton'>OK</button>");
	
	$(".card").off().on("click", function() {
		if ($(".cardSelected").length < 6)
			$(this).toggleClass("cardSelected");
		else
			$(this).removeClass("cardSelected");
	});
	
	$("#okNumberButton").off().on("click", function() {
		if ($(".cardSelected").length != 6) {
			var $numberInstruction = $("#numberInstruction");
			$numberInstruction.text("Please choose six tiles!");
			// TODO: error colour-flashing animation effect for this error
		} else {
			submitChosenTiles();
		}
	});
}

function submitChosenTiles() {
	var chosenNumbers = [];
	$(".cardSelected").each(function(i) {
		chosenNumbers.push($(this).attr("value"));
	});
	$(".card").remove();
	
	var $container = $("#numberGameDiv");
	var $numberTileDiv = $("#numberTiles");
	
	var $numberInstruction = $("#numberInstruction");
	$numberInstruction.text("Get as close to the target as you can!");
	
	$numberTileDiv.append(
		"<div style='margin: 1em;'>Target: "+
			"<span id='target'>" + getRandomNumber(101, 999) + "</span>"+
		"</div>");
	$numberTileDiv.append(
		"<div>"+
			"<span id='timer'>" + timerSeconds + "</span>"+
		"</div>");
	
	$numberTileDiv.append("<span class='card'>" + getNumberFromIndex(chosenNumbers[0]) + "</span>");
	for (var i=1; i<chosenNumbers.length; i++) {
		$numberTileDiv.append(generateOperationDropdown("operation" + i) +
			"<span class='card'>" + getNumberFromIndex(chosenNumbers[i]) + "</span>");
	}
	
	$(".card").off().on("click", function() {
		var $select = $(this).toggleClass("transparent")
			.next("select")
			.toggleClass("transparent");
		$select.prop("disabled", !($select.is(":disabled")));
	});
	
	var timer = startTimer();
	
	$("#okNumberButton").off().on("click", function() {
		stopTimer();
	});
	
	function startTimer() {
		var counter = timerSeconds;
		var $timerElement = $("#timer");
		var timer = setInterval(function() {
			counter--;
			if (counter >= 0) {
				$timerElement.text(counter);
			}
			
			if (counter == 0) {
				stopTimer();
			}
		}, 1000);
		return timer;
	}
	function stopTimer() {
		clearInterval(timer);
		processNumberAnswer();
	}
}

function generateOperationDropdown(elementId) {
	return "<select name='" + elementId + "'>"+
				"<option value='add'>+</option>"+
				"<option value='sub'>-</option>"+
				"<option value='mult'>*</option>"+
				"<option value='div'>&divide;</option>"+
			"</select>";
}

function getNumberFromIndex(index) {
	if (index >= largeNumberSet.length) {
		index -= largeNumberSet.length;
		return smallNumberSet[index];
	} else {
		return largeNumberSet[index];
	}
}


// -- process the user's answer --
function processNumberAnswer() {
	var numbersStack = [];
	var operationsStack = [];
	$(".card:not(.transparent)").each(function(i) {
		numbersStack.push(parseInt($(this).text()));
		
		var select = $(this).next("select")[0];
		var operation = $(select).val();
		if (operation != undefined) {
			while (operationsStack.length > 0 && hasPrecedence(operation, operationsStack[operationsStack.length - 1])) {
				numbersStack.push(doOperation(operationsStack.pop(), numbersStack.pop(), numbersStack.pop()));
			}
			operationsStack.push(operation);
		}
	});
	
	while(operationsStack.length != 0) {
		numbersStack.push(doOperation(operationsStack.pop(), numbersStack.pop(), numbersStack.pop()));
	}
	
	var finalAnswer = numbersStack.pop();
	displayAnswer(finalAnswer);
}

function displayAnswer(answer) {
	var target = parseInt($("#target").text());
	var $numberTileDiv = $("#numberTiles");
	
	var difference = Math.abs(target - answer);
	var pointsAwarded = 0;
	if (difference == 0)
		pointsAwarded = 10;
	else if (difference <= 5)
		pointsAwarded = 7;
	else if (difference <= 10)
		pointsAwarded = 5;
	totalScore += pointsAwarded;
	
	$numberTileDiv.empty().append("Target: <span id='target'>" + target + "</span>"+
		"<br>"+
		"Your answer: " + answer +
		"<br><br>"+
		"Difference: " + difference +
		"<br>"+
		pointsAwarded + " points awarded!"+
		"<br>"+
		"Your score is now " + totalScore);
	$("#numberInstruction").text("Would you like to play again?");
	$("#okNumberButton").off().on("click", function() {
		startNewNumberGame();
	});
}

// returns true if operation2 has a higher or the same precedence as operation1
function hasPrecedence(operation1, operation2) {
	return !(
		(operation1 == "mult" || operation1 == "div") &&
		(operation2 == "add" || operation2 == "sub"));
}

function doOperation(operation, number1, number2) {
	var result = 0;
	switch(operation) {
		case "mult":
			result = number2 * number1;
			break;
		case "div":
			result = number2 / number1;
			break;
		case "add":
			result = number2 + number1;
			break;
		case "sub":
			result = number2 - number1;
			break;
		default:
			console.log("Unknown operation: " + operation);
			return 0;
	}
	return result;
}
