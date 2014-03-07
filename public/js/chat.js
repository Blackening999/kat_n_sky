$(document).ready(function() {
	var input = $('#room input');
	var ul = $('#room ul');
	var form = $('#room form');
	var users = {};

	var socket = io.connect('', {
		reconnect: false
	});

	socket
		.on('message', function(username, message) {
			printMessage(username, message, "message");
		})
		.on('leave', function(username) {
			printStatus(username + " left chat", "leave");
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
//		$('<li class="' + getMsgColor(type) + '">').append($('<i>' + status + '</i>')).appendTo(ul);
	}

	function printMessage(username, message, type) {
		$('<li>').text(username + "> " + message).appendTo(ul);
//		if (type == "message") {
//			$('<li style="color: "+ users[username] +">').text(username + "> " + message).appendTo(ul);
//		} else {
//			$('<li class="' + getMsgColor(type) + '">').text(username + "> " + message).appendTo(ul);
//		}
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
			case "left":
				highlight = "text-warning";
				break;
		};
		return highlight;
	}

	function attachColor() {
		var color = [];
		do {
			for (var i = 0; i < 3; i++ ) {
				color[i] = Math.round(Math.random() * 255);
			}
		} while (lightColors(color));

		return decimalToHexString(color);
	}

	function lightColors(color) {
		var spread = 0;

		for ( var i = 0; i < 3; i++ ) {
			for ( var j = i+1; j < 3; j++ )
				if ( (color[i] - color[j]) > spread )
					return false;
		}
		return true;
	}

	function decimalToHexString(arr) {
		var res = [];
		for (var i = 0; i < arr.length; i++) {
			if (arr[i] < 0) {
				var num = 0xFFFFFFFF + arr[i] + 1;
				res[i] = num.toString(16).toUpperCase();
			}
		};
		return "#" + res.join("");
	}
});