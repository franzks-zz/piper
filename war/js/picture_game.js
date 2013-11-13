var arrPictureWrappers;
var dragSrcEl = null;

$(function() {
	
	arrPictureWrappers = document.querySelectorAll('.picture-wrapper');
	[].forEach.call(arrPictureWrappers, function(pic) {
		pic.addEventListener('dragstart', handleDragStart, false);
		pic.addEventListener('dragenter', handleDragEnter, false);
		pic.addEventListener('dragover', handleDragOver, false);
		pic.addEventListener('dragleave', handleDragLeave, false);
		pic.addEventListener('drop', handleDrop, false);
		pic.addEventListener('dragend', handleDragEnd, false);
	})
});

function handleDragStart(e) {
	this.style.opacity = '0.4';
	this.classList.add('selected');

	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);
}

function handleDragOver(e) {
	if(e.preventDefault) {
		e.preventDefault();
	}

	e.dataTransfer.dropEffect = 'move';

	return false;
}

function handleDragEnter(e) {
	this.classList.add('over');
}

function handleDragLeave(e) {
	this.classList.remove('over');
}

function handleDrop(e) {
	if(e.stopPropagation) {
		e.stopPropagation();
	}

	if(dragSrcEl != this) {
		dragSrcEl.innerHTML = this.innerHTML;
		this.innerHTML = e.dataTransfer.getData('text/html');
	}

	return false;
}

function handleDragEnd(e) {
	[].forEach.call(arrPictureWrappers, function(pic) {
		pic.classList.remove('over');
		pic.classList.remove('selected');
		pic.style.opacity = '1';
	})
}

function gapiOnLoadCallback() {
//	gapi.auth.authorize({
//		client_id: "854462595148.apps.googleusercontent.com",
//		immediate: true,
//		response_type: "token",
//		scope: ["https://www.googleapis.com/auth/plus.login"]
//	}, authorizeCallback);
	
	gapi.auth.setToken("token",localStorage.getItem("access_token"));
	
	console.log(localStorage.getItem("access_token"));
	console.log(gapi.auth.getToken("token",true));
}

//function authorizeCallback(authResult) {
//	console.log(authResult)
//}