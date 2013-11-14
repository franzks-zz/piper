$(function() {
	$("#mascot-bubble").text($("#msg-default").text());
	$("#game-icon-picture").hover(gameIconHoverIn, gameIconHoverOut);
	$("#game-icon-search").hover(gameIconHoverIn, gameIconHoverOut);
	$("#game-icon-trivia").hover(gameIconHoverIn, gameIconHoverOut);
	
	$("#game-icon-picture").click(gameIconPictureClick);
	$("#game-icon-search").click(gameIconSearchClick);
});

function gameIconPictureClick(e) {
	$("#wrap-inner").load("picture_game.html");
}

function gameIconSearchClick(e) {
	$("#wrap-inner").load("search_game.html");
}

function gameIconHoverIn(e) {
	if (e.target.id == "game-icon-picture") {
		$("#mascot-bubble").text($("#msg-picture").text());
	} else if (e.target.id == "game-icon-search") {
		$("#mascot-bubble").text($("#msg-search").text());
	} else if (e.target.id == "game-icon-trivia") {
		$("#mascot-bubble").text($("#msg-trivia").text());
	}
}

function gameIconHoverOut(e) {
	$("#mascot-bubble").text($("#msg-default").text());
}