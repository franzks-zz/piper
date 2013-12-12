$(function() {
	$("#btn-play").click(btnPlayClick);
});

function btnPlayClick(e) {
	$("#wrap-inner").load("homepage.html");
}
