var GAME_STATE_ONGOING = 1;
var GAME_STATE_ENDED = 2;

var gameState = GAME_STATE_ONGOING;

var name;
var nameScrambled;

$(function() {
	swapMascot(gender,MASCOT_REGULAR);
	$("#mascot-bubble").text($("#msg-default").text());
	$("#mascot-img").click(mascotClick);
	$("#btn-main-menu").click(btnMainMenuClick);
	retrievePerson();
});

function mascotClick(e) {
	
	if(gameState == GAME_STATE_ONGOING) {
		var answer = $("#txt-answer").val();
		answer = answer.toUpperCase();
		
		if(answer == name) {
			swapMascot(gender,MASCOT_WIN);
			$("#mascot-bubble").text($("#msg-correct").text());
			gameState = GAME_STATE_ENDED;
		} else {
			swapMascot(gender,MASCOT_SAD);
			$("#mascot-bubble").text($("#msg-wrong").text());
		}
	} else if(gameState == GAME_STATE_ENDED) {
		retrievePerson();
		swapMascot(gender,MASCOT_REGULAR);
		$("#mascot-bubble").text($("#msg-default").text());
		$("#txt-answer").val("");
		gameState = GAME_STATE_ONGOING;
	}
	
	
}

function btnMainMenuClick(e) {
	$("#wrap-inner").load("homepage.html");
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
			console.log(name);
			console.log(nameScrambled);
			$("#scramble-name").text(nameScrambled);
		});
	});
}

function chooseRandomPerson(resp) {
	var rand = Math.floor(Math.random()*100);
	
	name = resp.items[rand].displayName;
	
	if( (name.charAt(name.length-1) == '.') &&
		(name.charAt(name.length-2) == ' ')) {
		name = name.substring(0,name.length-2);
	}
	
	name = name.toUpperCase();
	name = name.replace(/\ /g,'');
	name = name.replace(/\./g,'');
	name = name.replace(/\-/g,'');
	
	nameScrambled = shuffle(name.split("")).join();
	
	nameScrambled = nameScrambled.replace(/\,/g,'');
}