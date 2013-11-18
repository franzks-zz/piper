$(function() {
	$("#btn-play-now").click(btnPlayNowClick);
});

function btnPlayNowClick(e) {
	$("#wrap-inner").load("homepage.html");
}
