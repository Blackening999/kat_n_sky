$(document).ready(function() {
	$(document.forms['login-form']).on('submit', function() {
		var form = $(this);

		$('.error', form).html('');
		$(":submit", form).button("loading");

		$.ajax({
			url: "/login",
			data: form.serialize(),
			method: "POST",
			complete: function() {
				$(":submit", form).button("reset");
			},
			statusCode: {
				200: function() {
					form.html("<div>You have entered!</div>").addClass('alert alert-success');
					window.location.href = "/chat";
				},
				403: function(jqXHR) {
					var error = JSON.parse(jqXHR.responseText);
					$('.error', form).html(error.message);
				}
			}
		});
		return false;
	});
});