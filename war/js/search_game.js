var GAME_STATE_ONGOING = 1;
var GAME_STATE_ENDED = 2;

var gameState = GAME_STATE_ONGOING;

var COLOR_DEFAULT = "#EEEEEE";
var COLOR_WRONG = "#ffffd4";
var COLOR_CORRECT = "#99ff55";

var arrNames = [];
var arrNamesPreserved = [];
var arrAnswerLocations = [];

var numOfCorrect = 0;

var arrPuzzle = [];

$(function() {
	swapMascot(gender,MASCOT_REGULAR);
	$("#mascot-bubble").text($("#msg-default").text());
	$("#btn-main-menu").click(btnMainMenuClick);
	$("#btn-skip").click(btnSkipClick);
	$("#btn-reveal").click(btnRevealClick);
	$("#mascot-img").click(mascotClick);
	
	$("table").on("click","td",tdClick)
	
	retrievePeople();
});

var prevTdId = "-";
var prevAnswer;

function tdClick(e) {
	
	colorCell(prevTdId,COLOR_DEFAULT);
	colorCells(prevAnswer,COLOR_DEFAULT);
	
	var coordCurrent = e.target.id.split("-");
	var coordPrev = prevTdId.split("-");
	
	if(		(coordCurrent[0] == coordPrev[0]) ||
			(coordCurrent[1] == coordPrev[1])) {
		
		var length;
		var x, y;
		var pos;
		
		if(coordCurrent[0] == coordPrev[0]) {
			length = parseInt(coordCurrent[1]) - parseInt(coordPrev[1]);
			pos = "vertical";
		} else if(coordCurrent[1] == coordPrev[1]) {
			length = parseInt(coordCurrent[0]) - parseInt(coordPrev[0]);
			pos = "horizontal";
		}
		
		if(length>=0) {
			x = coordPrev[0];
			y = coordPrev[1];
		} else {
			x = coordCurrent[0];
			y = coordCurrent[1];
		}
		
		var answer = {
				x: parseInt(x),
				y: parseInt(y),
				length: Math.abs(length) + 1,
				pos: pos};
		
		var result = checkAnswer(answer);
		
		if(result != -1) {
			colorCells(answer, COLOR_CORRECT);
			highlightNameList(arrNames[result]);
			numOfCorrect++;
			
			if(numOfCorrect == 10) {
				finishGame();
			}
		} else {
			colorCells(answer, COLOR_WRONG);
		}
		
	} else {
		colorCell(e.target.id,COLOR_WRONG);
	}
	
	prevTdId = e.target.id;
	prevAnswer = answer;
}

function colorCells(answer, color) {
	if(answer) {
		for(var i=0; i<answer.length; i++) {
			if(answer.pos == "horizontal") {
				colorCell((answer.x+i)+"-"+answer.y,color);
			} else if(answer.pos == "vertical") {
				colorCell(answer.x+"-"+(answer.y+i),color);
			}
		}
	}
}

function colorCell(id,color) {
	if($("#"+id).css("background-color") != COLOR_CORRECT) {
		$("#"+id).css("background-color",color);
	}
}

function highlightNameList(answer) {
	var listSpan = $(".name-list-span");
	
	for(var i=0; i<listSpan.length; i++) {
		
		var namePreserved = listSpan[i].textContent;
		namePreserved = namePreserved.replace(/\ /g,'');
		namePreserved = namePreserved.replace(/\-/g,'');

		if(namePreserved == answer) {
			$(listSpan[i]).css("color","green");
		}
	}
	
	
}

function checkAnswer(answer) {	
	for(var i=0; i<arrAnswerLocations.length; i++) {
		if( 	(answer.x == arrAnswerLocations[i].x) &&
				(answer.y == arrAnswerLocations[i].y) &&
				(answer.pos == arrAnswerLocations[i].pos) &&
				(answer.length == arrAnswerLocations[i].length)) {
			return i;
		}
	}
	
	return -1;
}

function finishGame() {
	colorAllWrongCells();
	$("#mascot-bubble").text($("#msg-finished").text());
	swapMascot(gender,MASCOT_WIN);
	gameState = GAME_STATE_ENDED;
}

function colorAllWrongCells() {
	for(var i=0; i<30; i++) {
		for(var j=0; j<30; j++) {
			colorCell(i+"-"+j,COLOR_WRONG)
		}
	}
}

function btnMainMenuClick(e) {
	$("#wrap-inner").load("homepage.html");
}

function btnSkipClick(e) {
	restart();
}

function btnRevealClick(e) {
	for(var i=0; i<arrAnswerLocations.length; i++) {
		colorCells(arrAnswerLocations[i],COLOR_CORRECT);
	}
	
	colorAllWrongCells();
	$(".name-list-span").css('color','green');
	
	finishGame();
}

function mascotClick(e) {
	if(gameState == GAME_STATE_ENDED) {
		restart();
	}
}

function restart() {
	gameState = GAME_STATE_ONGOING;
	
	arrNames = [];
	arrNamesPreserved = [];
	arrAnswerLocations = [];
	arrPuzzle = [];
	numOfCorrect = 0;
	
	$("table").empty();
	$(".name-list").empty();
	
	retrievePeople();
	
	$("#mascot-bubble").text($("#msg-default").text());
	swapMascot(gender,MASCOT_REGULAR);
}

function retrievePeople() {
	gapi.client.load('plus', 'v1', function() {
		var request = gapi.client.plus.people.list({
			'userId' : 'me',
			'collection' : 'visible',
			'orderBy' : 'best'
		});
		request.execute(function(resp) {
			chooseRandomPeople(resp);
			temporarilyFillPuzzle();
			generatePuzzle();
			fillPuzzle();
			displayPuzzle();
		});
	});
}

function chooseRandomPeople(resp) {
	
	for(var i=0; i<10; i++) {		
		var rand;
		
		if(resp.totalItems >= 100) {
			rand = Math.floor(Math.random()*100);
		} else {
			rand = Math.floor(Math.random()*resp.totalItems);
		}
		
		var name = resp.items[rand].displayName;
		
		if( (name.charAt(name.length-1) == '.') &&
			(name.charAt(name.length-2) == ' ')) {
			name = name.substring(0,name.length-2);
		}
		
		name = name.toUpperCase();
		name = name.replace(/\./g,'');
		
		var namePreserved = name;
		
		name = name.replace(/\ /g,'');
		name = name.replace(/\-/g,'');
		
		if($.inArray(name,arrNames) == -1) {
			arrNames.push(name);
			arrNamesPreserved.push(namePreserved);
		} else {
			i--;
		}
	}
	
	arrNames.sort(function(a, b) {
		return b.length - a.length;
	});
}

function temporarilyFillPuzzle() {
	for(var i=0; i<30; i++) {
		arrPuzzle[i] = [];
		for(var j=0; j<30; j++) {
			arrPuzzle[i][j] = '-';
		}
	}
}

function generatePuzzle() {
	
	var count = 0;
	
	for(var i=0; i<10; i++) {
		var randFull = Math.floor(Math.random()*30);
		var randSubtracted = Math.floor(Math.random()*(30-arrNames[i].length));
		
		if(i%2 == 0) {
			if(checkIfEmptyHorizontal(arrNames[i].length, randSubtracted, randFull)) {
				insertHorizontal(arrNames[i],randSubtracted,randFull);
				
				arrAnswerLocations.push({
					name:arrNames[i],
					x:randSubtracted,
					y:randFull,
					pos: "horizontal",
					length: arrNames[i].length
				});
			} else {
				i--;
			}
		} else {
			if(checkIfEmptyVertical(arrNames[i].length, randFull, randSubtracted)) {
				insertVertical(arrNames[i], randFull, randSubtracted);
				
				arrAnswerLocations.push({
					name:arrNames[i],
					x:randFull,
					y:randSubtracted,
					pos: "vertical",
					length: arrNames[i].length
				});
			} else {
				i--;
			}
		}
		
		if(++count > 100) {
			restart();
		} 
	}
}

function fillPuzzle() {
	
	var allowedLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	
	for(var i=0; i<30; i++) {
		for(var j=0; j<30; j++) {
			if(arrPuzzle[i][j] == '-') {
				arrPuzzle[i][j] = allowedLetters.charAt(Math.floor(Math.random()*26));
			}
		}
	}
}

function displayPuzzle() {
	
	for(var i=0; i<30; i++) {
		
		var tr = $("<tr>");
		
		for(var j=0; j<30; j++) {
			
			var td = $("<td>");
			
			td.attr("id",j+"-"+i);
			
			td.text(arrPuzzle[j][i])
			
			tr.append(td);
		}
		
		$("table").append(tr);
	}
	
	for(var i=0; i<10; i++) {
		var span = $("<span>");
		span.addClass("name-list-span");
		span.text(arrNamesPreserved[i]);
		
		if(i<5) {
			$("#name-list-left").append(span);
		} else {
			$("#name-list-right").append(span);
		}
	}
}

function printPuzzle() {
	for(var i=0; i<30; i++) {
		
		var str = "";
		
		for(var j=0; j<30; j++) {
			str += arrPuzzle[j][i];
		}
		
		console.log(str);
	}
}

function insertHorizontal(name, x, y) {
	for(var i=0; i<name.length; i++) {
		arrPuzzle[x+i][y] = name.charAt(i);
	}
}

function insertVertical(name, x, y) {
	for(var i=0; i<name.length; i++) {
		arrPuzzle[x][y+i] = name.charAt(i);
	}
}

function checkIfEmptyHorizontal(length, x, y) {
	for(var i=0; i<length; i++) {
		if(arrPuzzle[x+i][y] != '-') {
			return false;
		}
	}
	return true;
}

function checkIfEmptyVertical(length, x, y) {
	for(var i=0; i<length; i++) {
		if(arrPuzzle[x][y+i] != '-') {
			return false;
		}
	}
	return true;
}