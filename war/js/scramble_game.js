var GAME_STATE_ONGOING = 1;
var GAME_STATE_ENDED = 2;

var gameState = GAME_STATE_ONGOING;

var preservedName;
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
	$("#wrap-inner").css('display','none');
	$("#loading").css('display','block');
	restart();
}

function btnRevealClick(e) {
	finishGame();
	displayChars(preservedName.split(""));
}

function retrievePerson() {
	socialNetwork.retrieveFriends(1,retrievePersonCallback);
}

function retrievePersonCallback(resp) {
	chooseRandomPerson(resp);
	displayChars(arrScrambledChars);
	attachDragListeners();
	$("#loading").css('display','none');
	$("#wrap-inner").css('display','block');
}

function chooseRandomPerson(resp) {
	var name = resp[0][0];
	var url = resp[0][1];
	
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
	preservedName = name;
	
	arrScrambledChars = shuffle(name.split(""));
	
	// Show Blurred Profile Photo as a clue
	$("#blurred-image").attr("src",url);
	
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
		if($(arrCharAnswers[i]).text() != preservedName.charAt(i)) {
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