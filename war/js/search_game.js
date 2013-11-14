var arrNames = [];
var arrAnswers = [];

var arrPuzzle = [];

$(function() {
	$("#btn-main-menu").click(btnMainMenuClick);
	$("#mascot-img").click(mascotClick);
	
	retrievePeople();
});

function btnMainMenuClick(e) {
	$("#wrap-inner").load("homepage.html");
}

function mascotClick(e) {
	
	var index = $.inArray($("#txt-answer").val().toUpperCase(),arrNames);
	
	if(index != -1) {
		colorAnsweredCells(arrAnswers[index]);
	}

}

function colorAnsweredCells(answer) {
	for(var i=0; i<answer.length; i++) {
		if(answer.pos == "horizontal") {
			$("#"+(answer.x+i)+"-"+answer.y).css("background-color","yellow");
		} else if(answer.pos == "vertical") {
			$("#"+answer.x+"-"+(answer.y+i)).css("background-color","yellow");
		}
	}
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
			printPuzzle();
			fillPuzzle();
			displayPuzzle();
		});
	});
}

function chooseRandomPeople(resp) {
	
	for(var i=0; i<10; i++) {
		var rand = Math.floor(Math.random()*100);
		
		var name = resp.items[rand].displayName;
		name = name.toUpperCase();
		name = name.replace(/\ /g,'');
		name = name.replace(/\./g,'');
		name = name.replace(/\-/g,'');
		
		if($.inArray(name,arrNames) == -1) {
			arrNames.push(name);
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
	for(var i=0; i<10; i++) {
		var randFull = Math.floor(Math.random()*30);
		var randSubtracted = Math.floor(Math.random()*(30-arrNames[i].length));
		
		if(i%2 == 0) {
			if(checkIfEmptyHorizontal(arrNames[i].length, randSubtracted, randFull)) {
				insertHorizontal(arrNames[i],randSubtracted,randFull);
				
				arrAnswers.push({
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
				
				arrAnswers.push({
					x:randFull,
					y:randSubtracted,
					pos: "vertical",
					length: arrNames[i].length
				});
			} else {
				i--;
			}
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