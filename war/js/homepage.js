$(function() {
	$("#mascot-bubble").text($("#msg-default").text());
	$(".game-icon").hover(gameIconHoverIn, gameIconHoverOut);
	
	$(".game-icon").click(gameIconClick);
});

function gameIconClick(e) {
	try {
		if(gapi.auth.getToken().access_token) {			
			if (e.target.id == "game-icon-picture") {
				$("#wrap-inner").load("picture_game.html");
			} else if (e.target.id == "game-icon-search") {
				$("#wrap-inner").load("search_game.html");
			} else if (e.target.id == "game-icon-scramble") {
				$("#wrap-inner").load("scramble_game.html");
			}
		}
	} catch(err) {}
	
}

function gameIconHoverIn(e) {
	if (e.target.id == "game-icon-picture") {
		$("#mascot-bubble").text($("#msg-picture").text());
	} else if (e.target.id == "game-icon-search") {
		$("#mascot-bubble").text($("#msg-search").text());
	} else if (e.target.id == "game-icon-scramble") {
		$("#mascot-bubble").text($("#msg-scramble").text());
	}
}

function gameIconHoverOut(e) {
	$("#mascot-bubble").text($("#msg-default").text());
}