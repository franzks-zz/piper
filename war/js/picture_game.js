var GAME_STATE_ONGOING = 1;
var GAME_STATE_ENDED = 2;

var gameState = GAME_STATE_ONGOING;

var arrPictureWrappers;
var dragSrcEl = null;

var arrPeople = [];
var arrPeoplePics = [];
var arrPeoplePicsRandomized = [];
var arrPeopleNames = [];

var numOfMistakes = 0;

$(function() {
	swapMascot(gender,MASCOT_REGULAR);	
	$("#mascot-bubble").text($("#msg-default").text());
	$("#mascot-img").click(mascotClick);
	$("#btn-main-menu").click(btnMainMenuClick);
	$("#btn-new").click(btnNewClick);
	$("#btn-reveal").click(btnRevealClick);
	
	arrPictureWrappers = document.querySelectorAll('.picture-wrapper');
	[].forEach.call(arrPictureWrappers, function(pic) {
		pic.addEventListener('dragstart', handleDragStart, false);
		pic.addEventListener('dragenter', handleDragEnter, false);
		pic.addEventListener('dragover', handleDragOver, false);
		pic.addEventListener('dragleave', handleDragLeave, false);
		pic.addEventListener('drop', handleDrop, false);
		pic.addEventListener('dragend', handleDragEnd, false);
	})
	
	retrievePeople();
});

function mascotClick(e) {
	
	if(gameState == GAME_STATE_ONGOING) {
		checkAnswer();
		
		if(numOfMistakes > 0) {
			$("#mascot-bubble").text("Oooooops! There are still " + numOfMistakes + " profile picture(s) in the incorrect position.");
			
			swapMascot(gender,MASCOT_SAD);
			
		} else {
			finishGame();
		}
	} else if(gameState == GAME_STATE_ENDED) {
		restart();
	}	
}

function restart() {
	arrPeople = [];
	arrPeoplePics = [];
	arrPeoplePicsRandomized = [];
	arrPeopleNames = [];
	
	retrievePeople();
	gameState = GAME_STATE_ONGOING;
	
	$("#mascot-bubble").text($("#msg-default").text());
	swapMascot(gender,MASCOT_REGULAR);
}

function finishGame() {
	$("#mascot-bubble").text($("#msg-correct").text());
	swapMascot(gender,MASCOT_WIN);
	gameState = GAME_STATE_ENDED;
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
	displayPeople(arrPeoplePics);
	finishGame();
}

function handleDragStart(e) {
	this.style.opacity = '0.4';
	this.classList.add('selected');

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

function handleDrop(e) {
	if(e.stopPropagation) {
		e.stopPropagation();
	}

	if(dragSrcEl != this) {
		var parent = $(this).parent();
		var temp = $(dragSrcEl).replaceWith(this);
		
		$(parent).prepend(temp);
	}
	
	return false;
}

function handleDragEnd(e) {
	[].forEach.call(arrPictureWrappers, function(pic) {
		pic.classList.remove('over');
		pic.classList.remove('selected');
		pic.style.opacity = '1';
	})
}

function retrievePeople() {
	socialNetwork.retrieveFriends(retrievePeopleCallback);
}

function retrievePeopleCallback(resp) {
	chooseRandomPeople(resp);
	displayPeople(arrPeoplePicsRandomized);
	$("#loading").css('display','none');
	$("#wrap-inner").css('display','block');
}

function chooseRandomPeople(resp) {	
	for(var i=0; i<5; i++) {
		
		var rand;
		
		if(resp.totalItems >= 100) {
			rand = Math.floor(Math.random()*100);
		} else {
			rand = Math.floor(Math.random()*resp.totalItems);
		}
		
		if($.inArray(resp.items[rand],arrPeople) == -1) {			
			arrPeople.push(resp.items[rand]);
			
			var url = arrPeople[i].image.url;
			url = url.substring(0,url.length-2);
			url += "150";
			
			arrPeoplePics.push(url);
			
			var name = arrPeople[i].displayName;
			
			if( (name.charAt(name.length-1) == '.') &&
				(name.charAt(name.length-2) == ' ')) {
				name = name.substring(0,name.length-2);
			}
			
			arrPeopleNames.push(name);
		} else {
			i--;
		}
	}
	
	var arrRandomized = shuffle([0,1,2,3,4]);
	
	for(var i=0; i<5; i++) {
		arrPeoplePicsRandomized[i] = arrPeoplePics[arrRandomized.pop()];
	}
}

function displayPeople(arrPeoplePics) {	
	for(var i=1; i<=5; i++) {
		$("#name-" + i).text(arrPeopleNames[i-1]);
		$("#picture-" + i).css("background-image","url('"+arrPeoplePics[i-1]+"')");
	}
}

function checkAnswer() {
	numOfMistakes = 0;
	
	for(var i=0; i<5; i++) {
		
		var pictureWrapper = $(".picture-wrapper")[i];
		var url = $(pictureWrapper).css("background-image");
		url = url.replace(/"/g,'');
		url = url.substring(4,url.length-1);
		
		if(arrPeoplePics[i] != url) {
			numOfMistakes++;
		}
	}
}

