var mongoose = require('libs/mongoose');
mongoose.set('debug', true);
var async = require('async');

async.series([
	open,
	dropDataBase,
	requireModels,
	createUsers
], function(err) {
	mongoose.disconnect();
	process.exit(err ? 255 : 0);
});

function open(callback) {
	mongoose.connection.on('open', callback);
};

function dropDataBase(callback) {
	var db = mongoose.connection.db;
	db.dropDatabase(callback);
};

function requireModels(callback) {
	require('models/user');
	async.each(Object.keys(mongoose.models), function(modelName, callback) {
		mongoose.models[modelName].ensureIndexes(callback);
	}, callback);
};

function createUsers(callback) {
	var users = [
		{username: "Vasya", password: "vasya"},
		{username: "Petya", password: "petya"},
		{username: "Admin", password: "adm123"}
	];
	async.each(users, function(userData, callback) {   //this kind of each drops argument "affected" in callback,
		var user = new mongoose.models.User(userData); //so we don't need to reduce arguments to (err, results) from (err, results, affected)
		user.save(callback);
	}, callback);
};
