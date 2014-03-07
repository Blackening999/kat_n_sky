/**
 * Created by Blackening on 3/7/14.
 */
$(document).ready(function() {
	var navPanel = $('.nav.main-navigation');

	navPanel.find("signIn").off("click").on("click", function(e) {
		e.preventDefault();
		location.href = "/login";
	});

	navPanel.find("signOut").off("click").on("click", function(e) {
		e.preventDefault();
		$.post("/logout").done(function() {
			return;
		})
	});
});