$(function() {
	$("#wrap-inner").load("homepage.html");
});

function signinCallback(authResult) {
	if (authResult['access_token']) {		
		$("#signinButton").css("display", "none");
	} else if (authResult['error']) {
		$("#signinButton").css("display", "block");
	}
}

$.ajaxSetup({ cache: false });