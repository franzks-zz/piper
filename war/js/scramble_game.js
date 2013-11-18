var name;
var nameScrambled;

$(function() {
	$("#mascot-img").click(mascotClick);
	$("#btn-main-menu").click(btnMainMenuClick);
	retrievePerson();
});

function mascotClick(e) {
	var answer = $("#txt-answer").val();
	answer = answer.toUpperCase();
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