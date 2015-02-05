'use strict';

var _ = require('underscore'),
	models = require('../models');

module.exports = function customRender(req, res, next) {
	res.locals.xhr = req.xhr;
	res.conditionalRender = function(viewName, locals) {
		if (!req.xhr) {
			locals.dataLayer = _.clone(locals);
			// TODO Need to find out another way for properties loaded from middleware
			locals.dataLayer.categories = res.locals.categories;
			locals.dataLayer.shoppingCart = res.locals.shoppingCart;
			locals.dataLayer.template = viewName;
			res.render(viewName, locals);
		} else {
			locals.template = viewName;
			res.json(locals);
		}
	};
	next();
};