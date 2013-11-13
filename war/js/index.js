$(function() {
	$("#mascot-bubble").text($("#msg-default").text());
	$("#game-icon-picture").hover(gameIconHoverIn, gameIconHoverOut);
	$("#game-icon-age").hover(gameIconHoverIn, gameIconHoverOut);
	$("#game-icon-trivia").hover(gameIconHoverIn, gameIconHoverOut);
});

function gameIconHoverIn(e) {
	if(e.target.id == "game-icon-picture") {
		$("#mascot-bubble").text($("#msg-picture").text());
	} else if(e.target.id == "game-icon-age") {
		$("#mascot-bubble").text($("#msg-age").text());
	} else if(e.target.id == "game-icon-trivia") {
		$("#mascot-bubble").text($("#msg-trivia").text());
	}
}

function gameIconHoverOut(e) {
	$("#mascot-bubble").text($("#msg-default").text());
}