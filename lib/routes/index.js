'use strict';

var async = require('async'),
	catalogRouter = require('./catalog'),
	models = require('../models');

module.exports.configure = function(app) {

	/* GET home page. */
	app.get('/', function homeController(req, res, next) {
		async.parallel({
			categories: function (done) {
				models.Category.find().lean().exec(done);
			},
			featuredProducts: function (done) {
				models.Product.findFeatured(9, done);
			}
		}, function(err, results) {
			if (err) return next(err);

			res.render('index', {
				categories: results.categories,
				products: results.featuredProducts
			});
		});
	});

	app.use('/catalog', catalogRouter);

};

