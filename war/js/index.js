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

// util functions
function shuffle(array) {
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter--) {
        // Pick a random index
        index = (Math.random() * counter) | 0;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}