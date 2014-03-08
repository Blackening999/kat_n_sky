$(document).ready(function() {
	playAlert.content['main'] = 'http://www.mediacollege.com/downloads/sound-effects/star-wars/darthvader/darthvader_powerofthedarkside.wav';
	playAlert.content['login'] = 'http://www.mediacollege.com/downloads/sound-effects/star-wars/darthvader/darthvader_dontmakeme.wav';
	playAlert.content['logout'] = 'http://www.mediacollege.com/downloads/sound-effects/star-wars/darthvader/darthvader_lackoffaith.wav';
	if (location.href.indexOf("/login") > 1) {
		playAlert('login')
	} else if (location.href.indexOf("/logout") > 1){
		playAlert('logout');
	} else if (location.href.indexOf("/chat") > 1) {
	} else {
		playAlert('main');
	}
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