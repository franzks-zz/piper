var GAME_STATE_ONGOING = 1;
var GAME_STATE_ENDED = 2;

var gameState = GAME_STATE_ONGOING;

var name;
var image;
var arrScrambledChars;
var arrSpaceIndices = [];
var spaceCount;

var vague;

$(function() {
	swapMascot(gender,MASCOT_REGULAR);
	$("#mascot-bubble").text($("#msg-default").text());
	$("#mascot-img").click(mascotClick);
	$("#btn-main-menu").click(btnMainMenuClick);
	$("#btn-new").click(btnNewClick);
	$("#btn-reveal").click(btnRevealClick);
	retrievePerson();
});

function mascotClick(e) {
	if(gameState == GAME_STATE_ENDED) {
		restart();
	}
}

function restart() {
	retrievePerson();
	swapMascot(gender,MASCOT_REGULAR);
	$("#mascot-bubble").text($("#msg-default").text());
	gameState = GAME_STATE_ONGOING;
}

function btnMainMenuClick(e) {
	$("#wrap-inner").load("homepage.html");
}

function btnNewClick(e) {
	restart();
}

function btnRevealClick(e) {
	finishGame();
	displayChars(name.split(""));
}

function retrievePerson() {
	gapi.client.load('plus', 'v1', function() {
		var request = gapi.client.plus.people.list({
			'userId' : 'me',
			'collection' : 'visible',
			'orderBy' : 'best'
		});
		request.execute(function(resp) {
			chooseRandomPerson(resp);
			displayChars(arrScrambledChars);
			attachDragListeners();
		});
	});
}

function chooseRandomPerson(resp) {	
	var rand;
	
	if(resp.totalItems >= 100) {
		rand = Math.floor(Math.random()*100);
	} else {
		rand = Math.floor(Math.random()*resp.totalItems);
	}
	
	name = resp.items[rand].displayName;
	
	if( (name.charAt(name.length-1) == '.') &&
		(name.charAt(name.length-2) == ' ')) {
		name = name.substring(0,name.length-2);
	}
	
	spaceCount = 0;
	arrSpaceIndices = [];
	
	for(var i=0; i<name.length; i++) {
		if(name.charAt(i) == ' ') {
			arrSpaceIndices.push(i-spaceCount);
			spaceCount++;
		}
	}
	
	name = name.toUpperCase();
	name = name.replace(/\ /g,'');
	
	arrScrambledChars = shuffle(name.split(""));
	
	// Show Blurred Profile Photo as a clue
	var image = resp.items[rand].image.url;
	image = image.substring(0,image.length-2);
	image += "150";
	$("#blurred-image").attr("src",image);
	
	vague = $("#blurred-image").Vague({
		intensity: 5
	});
	vague.blur();
}

function displayChars(arrChars) {
	$("#scramble-name").empty();
	
	for(var i=0; i<arrChars.length; i++) {
		
		if($.inArray(i,arrSpaceIndices) != -1) {
			$("#scramble-name").append($("<br>"));
		}
		
		var div = $("<div>");
		div.addClass("scramble-char");
		div.attr("draggable",true);
		div.html(arrChars[i]);
		
		var wrapper = $("<div>");
		wrapper.css("display","inline-block");
		wrapper.append(div);
		
		$("#scramble-name").append(wrapper);
	}
}

// DRAGGING
var dragSrcEl = null;
var arrScrambledCharDivs = [];

function handleDragStart(e) {
	this.style.opacity = '0.4';

	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}

	e.dataTransfer.dropEffect = 'move';

	return false;
}

function handleDragEnter(e) {
	this.classList.add('over');
}

function handleDragLeave(e) {
	this.classList.remove('over');
}

function handleDragEnd(e) {
	[].forEach.call(arrScrambledCharDivs, function(pic) {
		pic.classList.remove('over');
		pic.style.opacity = '1';
	})
}

function handleDrop(e) {
	if(e.stopPropagation) {
		e.stopPropagation();
	}

	if(dragSrcEl != this) {
		var parent = $(this).parent();
		var temp = $(dragSrcEl).replaceWith(this);
		
		$(parent).prepend(temp);
	}
	
	if(checkAnswer()) {
		finishGame();
	}
	
	return false;
}

function attachDragListeners() {
	arrScrambledCharDivs = document.querySelectorAll('.scramble-char');
	[].forEach.call(arrScrambledCharDivs, function(div) {
		div.addEventListener('dragstart', handleDragStart, false);
		div.addEventListener('dragenter', handleDragEnter, false);
		div.addEventListener('dragover', handleDragOver, false);
		div.addEventListener('dragleave', handleDragLeave, false);
		div.addEventListener('drop', handleDrop, false);
		div.addEventListener('dragend', handleDragEnd, false);
	})
}

function checkAnswer() {
	var arrCharAnswers = $(".scramble-char");
	for(var i=0; i<arrCharAnswers.length; i++) {
		if($(arrCharAnswers[i]).text() != name.charAt(i)) {
			return false;
		}
	}
	return true;
}

function finishGame() {
	vague.unblur();
	swapMascot(gender,MASCOT_WIN);
	$("#mascot-bubble").text($("#msg-correct").text());
	gameState = GAME_STATE_ENDED;
}