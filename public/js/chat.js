/**
 * Created by Blackening on 3/7/14.
 */
$(document).ready(function() {
	var input = $('#room input');
	var ul = $('#room ul');
	var form = $('#room form');

	var socket = io.connect('', {
		reconnect: false
	});

	socket
		.on('message', function(username, message) {
			printMessage(username + "> " + message);
		})
		.on('leave', function(username) {
			printStatus(username + " left chat");
		})
		.on('join', function(username) {
			printStatus(username + " entered chat");
		})
		.on('connect', function() {
			printStatus("Connected");
			form.on('submit', sendMessage);
			input.prop('disabled', false);
		})
		.on('disconnect', function() {
			printStatus("Disconnected");
			form.off('submit', sendMessage);
			input.prop('disabled', true);
			this.$emit('error');
		})
		.on('logout', function() {
			location.href = "/";
		})
		.on('error', function(reason) {
			if (reason == "handshake unauthorized") {
				printStatus("You are left the chat");
			} else {
				setTimeout(function() {
					socket.socket.connect();
				}, 500);
			}
		});

	function sendMessage() {
		var text = input.val();
		socket.emit('message', text, function() {
			printMessage("Me> " + text);
		});

		input.val('');
		return false;
	}

	function printStatus(status) {
		$('<li>').append($('<i>').text(status)).appendTo(ul);
	}

	function printMessage(text) {
		$('<li>').text(text).appendTo(ul);
	}
});