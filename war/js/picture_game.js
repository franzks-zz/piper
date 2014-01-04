var GAME_STATE_ONGOING = 1;
var GAME_STATE_ENDED = 2;

var gameState = GAME_STATE_ONGOING;

var arrPictureWrappers;
var dragSrcEl = null;

var arrPeoplePics = [];
var arrPeoplePicsRandomized = [];
var arrPeopleNames = [];

var numOfMistakes = 0;

var soundPop = new Audio('../sfx/pop.mp3');
var soundDing = new Audio('../sfx/ding.mp3');

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
			finishGame(false);
		}
	} else if(gameState == GAME_STATE_ENDED) {
		restart();
	}	
}

function restart() {
	arrPeoplePics = [];
	arrPeoplePicsRandomized = [];
	arrPeopleNames = [];
	
	retrievePeople();
	gameState = GAME_STATE_ONGOING;
	
	$("#mascot-bubble").text($("#msg-default").text());
	swapMascot(gender,MASCOT_REGULAR);
}

function finishGame(revealed) {
	if(revealed) {
		$("#mascot-bubble").text($("#msg-revealed").text());
	} else {
		$("#mascot-bubble").text($("#msg-correct").text());
		swapMascot(gender,MASCOT_WIN);
	}
	
	gameState = GAME_STATE_ENDED;
	
	soundDing.currentTime = 0;
	soundDing.play();
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
	finishGame(true);
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
		var source = $(dragSrcEl);
		
		var parentUrl = parent.context.style.backgroundImage;
		var sourceUrl = source.context.style.backgroundImage;
		
		parent.context.style.backgroundImage = sourceUrl;
		source.context.style.backgroundImage = parentUrl;
		
		soundPop.currentTime = 0;
		soundPop.play();
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
	socialNetwork.retrieveFriends(5,retrievePeopleCallback);
}

function retrievePeopleCallback(resp) {
	chooseRandomPeople(resp);
	displayPeople(arrPeoplePicsRandomized);
	$("#loading").css('display','none');
	$("#wrap-inner").css('display','block');
}

function chooseRandomPeople(resp) {	
	
	for(var i=0; i<5; i++) {
		arrPeopleNames.push(resp[i][0]);
		arrPeoplePics.push(resp[i][1]);
	}
	
	var arrRandomized = shuffle([0,1,2,3,4]);
	
	for(var i=0; i<5; i++) {
		arrPeoplePicsRandomized[i] = arrPeoplePics[arrRandomized.pop()];
	}
}

function displayPeople(arrPics) {
	for(var i=1; i<=5; i++) {
		$("#name-" + i).text(arrPeopleNames[i-1]);
		$("#picture-" + i).css("background-image","url('"+arrPics[i-1]+"')");
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

