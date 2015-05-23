'use strict';

var $ = require('jquery'),
	controllersManager = require('./plugins/controllers-manager'),
	router = require('./plugins/router');

controllersManager.config($(document.body), function() {
	router.init();
});
