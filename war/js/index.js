$.ajaxSetup({
	cache : false
});

var socialNetwork;

$(function() {
	socialNetwork = new SocialNetwork();

	$("#wrap-inner").load("landing.html");
	$("#logo").click(logoClick);
	$("#btn-sign-out").click(socialNetwork.btnSignOutClick);
});

function logoClick(e) {
	document.location.href = "/";
}

var GENDER_MALE = 1;
var GENDER_FEMALE = 2;

var MASCOT_REGULAR = 1;
var MASCOT_SAD = 2;
var MASCOT_WIN = 3;

var gender;
var mascotPose;

function randomizeGender() {
	gender = Math.floor(Math.random() * 2 + 1);
}

function swapMascot(gender, mascotPose) {
	if (gender == GENDER_MALE) {

		if (mascotPose == MASCOT_REGULAR) {
			$("#mascot-img").attr("src", "img/mascot_boy.png");
		} else if (mascotPose == MASCOT_SAD) {
			$("#mascot-img").attr("src", "img/mascot_boy_sad.png");
		} else if (mascotPose == MASCOT_WIN) {
			$("#mascot-img").attr("src", "img/mascot_boy_win.png");
		}

	} else if (gender == GENDER_FEMALE) {

		if (mascotPose == MASCOT_REGULAR) {
			$("#mascot-img").attr("src", "img/mascot_girl.png");
		} else if (mascotPose == MASCOT_SAD) {
			$("#mascot-img").attr("src", "img/mascot_girl_sad.png");
		} else if (mascotPose == MASCOT_WIN) {
			$("#mascot-img").attr("src", "img/mascot_girl_win.png");
		}

	}
}

/*
 * Util Functions
 */
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
	$(arrayOfImages).each(function() {
		$('<img/>')[0].src = this;
	});
}

$.cssHooks.backgroundColor = {
	get : function(elem) {
		if (elem.currentStyle)
			var bg = elem.currentStyle["backgroundColor"];
		else if (window.getComputedStyle)
			var bg = document.defaultView.getComputedStyle(elem, null)
					.getPropertyValue("background-color");
		if (bg.search("rgb") == -1)
			return bg;
		else {
			bg = bg.replace("rgba", "rgb");
			if (bg.match(/,/g).length > 2) {
				bg = bg.substring(0, bg.lastIndexOf(','));
				bg += ')';
			}
			bg = bg.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
			function hex(x) {
				return ("0" + parseInt(x).toString(16)).slice(-2);
			}
			return "#" + hex(bg[1]) + hex(bg[2]) + hex(bg[3]);
		}
	}
}

/*
 * Variables to check which social network was used for login
 */

var PLATFORM_GOOGLE = 1;
var PLATFORM_FACEBOOK = 2;

var platform = -1;

/*
 * Object for handling all social-network related API calls
 */

function SocialNetwork() {
	this.justSignedOut = false;
}

SocialNetwork.prototype.displayUser = function(displayName, url) {
	$("#nav-profile-photo").attr('src', url);
	$("#welcome-message").text("Welcome, " + displayName + "!");
	$("#nav-profile").css('display', 'block');
}

SocialNetwork.prototype.btnSignOutClick = function(e) {
	socialNetwork.justSignedOut = true;

	if (platform == PLATFORM_GOOGLE) {
		gapi.auth.signOut();
	} else if (platform == PLATFORM_FACEBOOK) {
		FB.api('/me/permissions', 'DELETE', function(response) {
			document.location.href = "/";
		});
	}
}

SocialNetwork.prototype.retrieveFriends = function(callback) {
	gapi.client.load('plus', 'v1', function() {
		var request = gapi.client.plus.people.list({
			'userId' : 'me',
			'collection' : 'visible',
			'orderBy' : 'best'
		});
		request.execute(function(resp) {
			callback(resp);
		});
	});
}

function gPlusSigninCallback(authResult) {
	if (authResult['access_token']) {
		platform = PLATFORM_GOOGLE;
		$("#signin-wrapper").css("display", "none");

		// Check to see if user has at least 10 friends
		gapi.client.load('plus', 'v1', function() {
			var request = gapi.client.plus.people.list({
				'userId' : 'me',
				'collection' : 'visible',
				'orderBy' : 'best'
			});
			request.execute(function(resp) {
				if (resp.totalItems >= 10) {
					$("#btn-play").css("display", "block");
				} else {
					$("#msg-error").css("display", "block");
				}
			});
		});

		gapi.client.load('plus', 'v1', function() {
			var request = gapi.client.plus.people.get({
				'userId' : 'me'
			});
			request.execute(function(resp) {
				var url = resp.image.url;
				url = url.substring(0, url.length - 2);
				url += "30";
				socialNetwork.displayUser(resp.displayName, url);
			});
		});

		randomizeGender();
	} else if (authResult['error']) {
		if (socialNetwork.justSignedOut) {
			document.location.href = "/";
		} else if (platform != PLATFORM_FACEBOOK) {
			$("#signin-wrapper").css("display", "block");
		}
	}
}

window.fbAsyncInit = function() {
	FB.init({
		appId : '606653572730623',
		status : true,
		cookie : true,
		xfbml : true
	});

	$("#signin-facebook").click(signinFacebookClick);

	FB.Event.subscribe('auth.authResponseChange', function(response) {
		// Here we specify what we do with the response anytime this event
		// occurs.
		if (response.status === 'connected') {
			// The response object is returned with a status field that lets the
			// app know the current
			// login status of the person. In this case, we're handling the
			// situation where they
			// have logged in to the app.
			platform = PLATFORM_FACEBOOK;

			$("#signin-wrapper").css("display", "none");
			$("#btn-play").css("display", "block");
			FB.api('/me', function(response) {
				var url = "https://graph.facebook.com/" + response.id
						+ "/picture?width=30&height=30";
				socialNetwork.displayUser(response.name, url);
			});
			randomizeGender();
		} else if (response.status === 'not_authorized') {
			// In this case, the person is logged into Facebook, but not into
			// the app, so we call
			// FB.login() to prompt them to do so.
			// In real-life usage, you wouldn't want to immediately prompt
			// someone to login
			// like this, for two reasons:
			// (1) JavaScript created popup windows are blocked by most browsers
			// unless they
			// result from direct interaction from people using the app (such as
			// a mouse click)
			// (2) it is a bad experience to be continually prompted to login
			// upon page load.
			$("#signin-wrapper").css("display", "block");
		} else {
			// In this case, the person is not logged into Facebook, so we call
			// the login()
			// function to prompt them to do so. Note that at this stage there
			// is no indication
			// of whether they are logged into the app. If they aren't then
			// they'll see the Login
			// dialog right after they log in to Facebook.
			// The same caveats as above apply to the FB.login() call here.
			$("#signin-wrapper").css("display", "block");
		}
	});
}

function signinFacebookClick() {
	FB.login();
}
