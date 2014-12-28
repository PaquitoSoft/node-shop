'use strict';

var models = require('../models');

module.exports = function customRender(req, res, next) {
	res.conditionalRender = function(viewName, locals) {
		if (!req.xhr) {
			res.render(viewName, locals);
		} else {
			res.json(locals);
		}
	};
	next();
};