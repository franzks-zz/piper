<jsp:include page="_header.jsp" />

<div class="container main-index">

	<div id="mascot-container" class="row">
		<div class="col-xs-6 mascot-img-container">
			<img id="mascot-img" src="img/mascot.png">
		</div>
		<div class="col-xs-5">
			<div id="mascot-bubble">
				Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
			</div>
		</div>
	</div>	
	
	<span id="signinButton">
		<span class="g-signin" data-callback="signinCallback"
		data-clientid="854462595148.apps.googleusercontent.com"
		data-cookiepolicy="single_host_origin"
		data-requestvisibleactions="http://schemas.google.com/AddActivity"
		data-scope="https://www.googleapis.com/auth/plus.login"></span>
	</span>

</div>

<jsp:include page="_footer.jsp" />