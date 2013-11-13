$(function() {
	$("#mascot-bubble").text($("#msg-default").text());
	$("#game-icon-picture").hover(gameIconHoverIn, gameIconHoverOut);
	$("#game-icon-age").hover(gameIconHoverIn, gameIconHoverOut);
	$("#game-icon-trivia").hover(gameIconHoverIn, gameIconHoverOut);
	
	$("#game-icon-picture").click(gameIconPictureClick);
});

function gameIconPictureClick(e) {
	e.preventDefault();
	
	$("#wrap").load("picture_game.html");
}

function gameIconHoverIn(e) {
	if (e.target.id == "game-icon-picture") {
		$("#mascot-bubble").text($("#msg-picture").text());
	} else if (e.target.id == "game-icon-age") {
		$("#mascot-bubble").text($("#msg-age").text());
	} else if (e.target.id == "game-icon-trivia") {
		$("#mascot-bubble").text($("#msg-trivia").text());
	}
}

function gameIconHoverOut(e) {
	$("#mascot-bubble").text($("#msg-default").text());
}

function signinCallback(authResult) {
	if (authResult['access_token']) {
		
		$("#signinButton").css("display", "none");
		$("#game-chooser").css("display", "block");
	} else if (authResult['error']) {
		// Update the app to reflect a signed out user
		// Possible error values:
		// "user_signed_out" - User is signed-out
		// "access_denied" - User denied access to your app
		// "immediate_failed" - Could not automatically log in the user
		console.log('Sign-in state: ' + authResult['error']);
	}
}