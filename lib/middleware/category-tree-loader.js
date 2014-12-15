'use strict';

var models = require('../models');

module.exports = function categoryTreeLoader(req, res, next) {
	models.Category.find().lean().exec(function(err, categories) {
		if (!err) {
			req.categories = res.locals.categories = categories;
		}
		next(err);
	});
};