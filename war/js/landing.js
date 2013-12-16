$(function() {
	$("#btn-play").click(btnPlayClick);
});

function btnPlayClick(e) {
	$("#wrap-inner").css('display','none');
	$("#loading").css('display','block');
	$("#wrap-inner").load("homepage.html", function() {
		$("#loading").css('display','none');
		$("#wrap-inner").css('display','block');
	});
}
