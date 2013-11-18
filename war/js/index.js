$(function() {
	$("#wrap-inner").load("landing.html");
});

function signinCallback(authResult) {
	if (authResult['access_token']) {		
		$("#signinButton").css("display", "none");
		
		gapi.client.load('plus', 'v1', function() {
			var request = gapi.client.plus.people.list({
				'userId' : 'me',
				'collection' : 'visible',
				'orderBy' : 'best'
			});
			request.execute(function(resp) {
				if(resp.totalItems >= 10) {
					$("#btn-play-now").css("display", "block");
				} else {
					$("#msg-error").css("display", "block");
				}
			});
		});
		
		randomizeGender();
	} else if (authResult['error']) {
		$("#signinButton").css("display", "block");
	}
}

var GENDER_MALE = 1;
var GENDER_FEMALE = 2;

var MASCOT_REGULAR = 1;
var MASCOT_SAD = 2;
var MASCOT_WIN = 3;

var gender;
var mascotPose;

function randomizeGender() {
	gender = Math.floor(Math.random()*2+1);
}

function swapMascot(gender, mascotPose) {
	if(gender == GENDER_MALE) {
		
		if(mascotPose == MASCOT_REGULAR) {
			$("#mascot-img").attr("src","img/mascot_boy.png");
		} else if(mascotPose == MASCOT_SAD) {
			$("#mascot-img").attr("src","img/mascot_boy_sad.png");
		} else if(mascotPose == MASCOT_WIN) {
			$("#mascot-img").attr("src","img/mascot_boy_win.png");
		}
		
	} else if(gender == GENDER_FEMALE) {
		
		if(mascotPose == MASCOT_REGULAR) {
			$("#mascot-img").attr("src","img/mascot_girl.png");
		} else if(mascotPose == MASCOT_SAD) {
			$("#mascot-img").attr("src","img/mascot_girl_sad.png");
		} else if(mascotPose == MASCOT_WIN) {
			$("#mascot-img").attr("src","img/mascot_girl_win.png");
		}
		
	}
}

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

function preloadImages(arrayOfImages) {
    $(arrayOfImages).each(function(){
        $('<img/>')[0].src = this;
    });
}