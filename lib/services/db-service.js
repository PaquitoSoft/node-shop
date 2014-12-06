'use strict';

var mongoose = require('mongoose');

module.exports.connect = function _connect(dbConfig, done) {
	var db;

	mongoose.connect(dbConfig.connectionUrl)

	db = mongoose.connection;

	db.on('error', console.error.bind(console, 'MongoDB connection error:'));
	db.once('open', done);
};