var express = require('express');
var http = require('http');
var path = require('path');
var config = require('config');
var log = require('./libs/log')(module);
var mongoose = require('./libs/mongoose');
var HttpError = require('./error').HttpError;

var app = express();

app.engine('ejs', require('ejs-locals'));
app.set('views', path.join(__dirname, 'templates'));
app.set('view engine', 'ejs');

app.use(express.favicon(path.join(__dirname, 'public/images/favicon.ico')));

if (app.get('env') == 'development') {
	app.use(express.logger('dev'));
} else {
	app.use(express.logger('default'));
}

app.use(express.json());
app.use(express.urlencoded());

app.use(express.cookieParser());

app.use(express.session( {
	secret: config.get('session:secret'),
	key: config.get('session:key'),
	cookie: config.get('session:cookie'),
	store: require('./libs/sessionStore')
}));

app.use(require('./middleware/sendHttpError'));
app.use(require('./middleware/loadUser'));

app.use(app.router);

require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res) {
	res.send(404, "Page not found");
});

app.use(function(err, req, res, next) {
	if (typeof  err == 'number') {
		err = new HttpError(err);
	}
	if (err instanceof  HttpError) {
		res.sendHttpError(err);
	} else {
		if (app.get('env') == 'development') {
			express.errorHandler()(err, req, res, next);
		} else {
			log.error(err);
			err = new HttpError(500);
			res.sendHttpError(err);
		}
	}
});

//chat here
var port = Number(process.env.PORT || 5000);
var server = http.createServer(app).listen(port, function() {
	console.log('Express server listening on port ' + config.get('port'));
});

var io = require('./socket')(server);
app.set('io', io);