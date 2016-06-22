var vowelArray = ['A', 'E', 'I', 'O', 'U'];
var consonantArray = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
var numberOfLetters = 10;
var wordGameAnagram = "";

function generateWordGameContent() {
	// TODO: add instructions for how to play
	// http://datagenetics.com/blog/august32014/index.html
	startNewWordGame();
}

function startNewWordGame() {
	var $container = $("#wordGameDiv");
	$container.empty();
	
	var $letterTilesDiv = $("<div id='letterTiles'></div>");
	$container.append($letterTilesDiv);
	
	var $letterTileHoldingDiv = $("<div id='tileHolder' style='margin: .5em;'></div>");
	$letterTilesDiv.append($letterTileHoldingDiv);
	
	var $instructionSpan = $("<span id='wordInstruction' style='display: block;'>Fill the boxes with letters!  Choose 'vowel' or 'consonant' to get a random letter.</span>");
	$container.append($instructionSpan);
	
	for (var i=0; i<numberOfLetters; i++) {
		$letterTileHoldingDiv.append("<div class='card' style='min-height: 1em;'></div>");
	}
	$letterTilesDiv.append("<button id='vowelButton' style='margin: .5em;'>Vowel</button>");
	$letterTilesDiv.append("<button id='consonantButton'>Consonant</button>");
	
	$("#vowelButton").on("click", function() {
		var vowel = vowelArray[getRandomNumber(0, vowelArray.length)];
		addLetterToNextTile(vowel);
	});
	$("#consonantButton").on("click", function() {
		var consonant = consonantArray[getRandomNumber(0, consonantArray.length)];
		addLetterToNextTile(consonant);
	});
}

function addLetterToNextTile(letter) {
	var letterTile = $("div.card:not(.cardFilled)")[0];
	$(letterTile).text(letter).addClass("cardFilled");
	// if all the cards have been filled
	if ($("div.card:not(.cardFilled)").length == 0)
		createAnagramPage();
}

function createAnagramPage() {
	var $letterTilesDiv = $("#letterTiles");
	var $container = $("#wordGameDiv");
	var $letterTileHoldingDiv = $("#tileHolder");
	
	$("#vowelButton").remove()
	$("#consonantButton").remove();
	$("#wordInstruction").text("Click the letters to create an anagram in the blue box!");
	
	var $anagramDiv = $("<div id='anagram' style='min-height: 4em;'></div>");
	$letterTilesDiv.append($anagramDiv);
	$("div.card").on("click", function() {
		if ($(this).hasClass("anagram")) {
			$(this).removeClass("anagram").detach();
			$letterTileHoldingDiv.append($(this));
		}
		else {
			$(this).addClass("anagram").detach();
			$anagramDiv.append($(this));
		}
	});
	
	var $okWordButton = $("<button id='okWordButton'>OK</button>");
	$container.append($okWordButton);
	
	$letterTilesDiv.append(
		"<div>"+
			"<span id='timer'>" + timerSeconds + "</span>"+
		"</div>");
	
	var timer = startTimer();
	
	$okWordButton.off().on("click", function() {
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
		processWordAnswer();
	}
}

function processWordAnswer() {
	wordGameAnagram = "";
	$(".card.anagram").each(function(i) {
		wordGameAnagram += $(this).text();
	});
	wordGameAnagram = wordGameAnagram.toLowerCase();
	var url = "https://dictionary.yandex.net/api/v1/dicservice.json/lookup";
	
	// using jsonp to avoid same origin policy issues
	$.ajax({
		url: url,
		dataType: "jsonp",
		data: {
			callback: "checkDictionaryResponse",
			text: wordGameAnagram,
			key: "dict.1.1.20160622T190255Z.c281f9acff4998fc.b2872c76772d6ff3fb45f04952a8dca4fe4cd006",
			lang: "en-en"
		}
	});
}

function checkDictionaryResponse(response) {
	var $letterTilesDiv = $("#letterTiles");
	$letterTilesDiv.empty().append("Your anagram: " + wordGameAnagram + "<br><br>");
	
	if (response.def.length == 0) {
		$letterTilesDiv.append("It appears as though your anagram is not a word!");
	} else {
		$letterTilesDiv.append(wordGameAnagram.length + " points awarded!");
		totalScore += wordGameAnagram.length;
	}
	
	$letterTilesDiv.append("<br>"+
		"Your score is now " + totalScore);
	
	$("#wordInstruction").text("Would you like to play again?");
	$("#okWordButton").off().on("click", function() {
		startNewWordGame();
	});
}
