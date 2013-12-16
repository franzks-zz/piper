$(function() {
	swapMascot(gender, MASCOT_REGULAR);
	$("#mascot-bubble").text($("#msg-default").text());
	$(".game-icon").hover(gameIconHoverIn, gameIconHoverOut);

	$(".game-icon").click(gameIconClick);

	preloadImages([
	               "img/picture_game_icon_hover.png",
	               "img/search_game_icon_hover.png",
	               "img/scramble_game_icon_hover.png"]);
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

function gameIconHoverIn(e) {
	if (e.target.id == "game-icon-picture") {
		$("#mascot-bubble").text($("#msg-picture").text());
		$("#game-icon-picture").attr("src", "img/picture_game_icon_hover.png");
	} else if (e.target.id == "game-icon-search") {
		$("#mascot-bubble").text($("#msg-search").text());
		$("#game-icon-search").attr("src", "img/search_game_icon_hover.png");
	} else if (e.target.id == "game-icon-scramble") {
		$("#mascot-bubble").text($("#msg-scramble").text());
		$("#game-icon-scramble")
				.attr("src", "img/scramble_game_icon_hover.png");
	}
}

function gameIconHoverOut(e) {
	$("#mascot-bubble").text($("#msg-default").text());

	if (e.target.id == "game-icon-picture") {
		$("#game-icon-picture").attr("src", "img/picture_game_icon.png");
	} else if (e.target.id == "game-icon-search") {
		$("#game-icon-search").attr("src", "img/search_game_icon.png");
	} else if (e.target.id == "game-icon-scramble") {
		$("#game-icon-scramble").attr("src", "img/scramble_game_icon.png");
	}
}