$(document).ready(function() {
	var inputArea = $('.input-area'), input = inputArea.find('input'), form = inputArea.find('form'), room = $('.room'),
		ul = room.find('ul'), users = {};

	var socket = io.connect('', {
		reconnect: false
	});

	socket
		.on('message', function(username, message) {
			printMessage(username, message, "message");
		})
		.on('leave', function(username) {
			printStatus(username + " left chat", "leave");
			delete users[username];
		})
		.on('join', function(username) {
			users[username] = attachColor();
			printStatus(username + " entered chat", "join");
		})
		.on('connect', function() {
			printStatus("Connected", "connect");
			form.on('submit', sendMessage);
			input.prop('disabled', false);
		})
		.on('disconnect', function() {
			printStatus("Disconnected", "disconnect");
			form.off('submit', sendMessage);
			input.prop('disabled', true);
			this.$emit('error');
		})
		.on('logout', function() {
			location.href = "/";
		})
		.on('error', function(reason) {
			if (reason == "handshake unauthorized") {
				printStatus("You are left the chat", "alert");
			} else {
				setTimeout(function() {
					socket.socket.connect();
				}, 500);
			}
		});

	function sendMessage() {
		var text = input.val();
		socket.emit('message', text, function() {
			printMessage("Me", text, "my-message");
		});
		input.val('');
		return false;
	}

	function printStatus(status, type) {
		$('<li class="' + getMsgColor(type) + '">').append($('<i>' + status + '</i>')).appendTo(ul);
		scrollDown();
	}

	function printMessage(username, message, type) {
		if (type == "message") {
			users[username] = users[username] ? users[username] : attachColor();
			$('<li>').text(username + "> " + message).appendTo(ul).end().css("color", users[username]);
		} else {
			$('<li class="' + getMsgColor(type) + '">').text(username + "> " + message).appendTo(ul);
		}
		scrollDown();
	}

	function getMsgColor(type) {
		var highlight;
		switch (type) {
			case "my-message":
				highlight = "text-primary your-message";
				break;
			case "message":
				highlight = "text-primary";
				break;
			case "connect":
				highlight = "text-success";
				break;
			case "disconnect":
				highlight = "text-danger";
				break;
			case "join":
				highlight = "text-info";
				break;
			case "leave":
				highlight = "text-warning";
				break;
		}
		;
		return highlight;
	}

	function attachColor() {
		var color = [];
		do {
			for (var i = 0; i < 3; i++) {
				color[i] = Math.round(Math.random() * 255);
			}
		} while (lightColors(color));

		return decimalToHexString(color);
	}

	function lightColors(color) {
		var spread = 0;
		for (var i = 0; i < 3; i++) {
			for (var j = i + 1; j < 3; j++)
				if ((color[i] - color[j]) > spread)
					return false;
		}
		return true;
	}

	function decimalToHexString(arr) {
		var res = [];
		for (var i = 0; i < arr.length; i++) {
			res[i] = arr[i].toString(16).toUpperCase();
		};
		return "#" + res.join("");
	}

	function scrollDown() {
		room.animate({scrollTop: 10000}, 400);
	}
});