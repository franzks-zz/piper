$(function() {
	swapMascot(gender, MASCOT_REGULAR);
	$("#mascot-bubble").text($("#msg-default").text());

	$(".game-icon").click(gameIconClick);
});

function gameIconClick(e) {
	try {
		if (gapi.auth.getToken().access_token) {
			$("#wrap-inner").css('display','none');
			$("#loading").css('display','block');
			
			if (e.target.id == "game-icon-picture") {
				$("#wrap-inner").load("picture_game.html");
			} else if (e.target.id == "game-icon-search") {
				$("#wrap-inner").load("search_game.html");
			} else if (e.target.id == "game-icon-scramble") {
				$("#wrap-inner").load("scramble_game.html");
			}
		}
	} catch (err) {
	}

}