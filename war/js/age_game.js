$(function() {
	
	$("#btn-main-menu").click(btnMainMenuClick);
	
	retrievePerson();
});

function btnMainMenuClick(e) {
	$("#wrap-inner").load("homepage.html");
}

function retrievePerson() {

}