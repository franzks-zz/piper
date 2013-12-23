$(function() {
	swapMascot(gender, MASCOT_REGULAR);
	$("#mascot-bubble").text($("#msg-default").text());
	$(".game-icon").click(gameIconClick);
	$(".game-icon").hover(gameIconHoverIn, gameIconHoverOut);
});

function gameIconClick(e) {
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