$(document).ready(function() {
	playAlert.content['main'] = 'http://www.mediacollege.com/downloads/sound-effects/star-wars/darthvader/darthvader_powerofthedarkside.wav';
	if (location.href.indexOf("/") < 1) playAlert('main');
	var navPanel = $('.nav.main-navigation');
	navPanel.find("#signIn").off("click").on("click", function(e) {
		e.preventDefault();
		location.href = "/login";
	});
	navPanel.find("#signOut").off("click").on("click", function(e) {
		e.preventDefault();
		$.post("/logout").done(function() {

		})
	});
});