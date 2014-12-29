'use strict';

var async = require('async'),
	fs = require('fs'),
	hbs = require('handlebars'),
	catalogRouter = require('./catalog'),
	shopRouter = require('./shop'),
	middleware = require('../middleware'),
	models = require('../models');

module.exports.configure = function(app) {

	var templatesCache = {};
	var DUST_CONTENT_REGEXP = /\{<\s*mainContent\}([^]*)\{\/\s?mainContent\}/;
	var DUST_PARTIALS_REGEXP = /\{>\s?"(.*)".*\/\}/g;

	// Common custom middleware
	app.use(middleware.customRender);
	app.use(middleware.shopCartLoader);

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

			res.conditionalRender('home', {
				categories: results.categories,
				products: results.featuredProducts
			});	
		});
	});

	app.get('/_templates/:templatePath', function(req, res, next) {
		var tpl, partials;
		console.log('--->', req.params.templatePath);
		if (req.params.templatePath) {
			tpl = templatesCache[req.params.templatePath];
			if (tpl) {
				res.send(tpl);
			} else {
				fs.readFile(__dirname + '/../../views/' + req.params.templatePath, {encoding: 'utf8'}, function(err, data) {
					if (err) return next(err);
					try {
						tpl = DUST_CONTENT_REGEXP.exec(data);
						
						if (tpl) {
							partials = DUST_PARTIALS_REGEXP.exec(tpl[1]);
							if (partials) {
								console.log('---> Partials:', partials);
							}
							res.send(tpl[1]);
							// templatesCache[req.params.templatePath] = tpl[1];
						} else {
							res.status(412).send('Could not pre-process template');
						}
					} catch (err) {
						return next(err);
					}
				});
			}
		} else {
			return next();
		}
	});

	app.use('/catalog', catalogRouter);
	app.use('/shop', shopRouter);
};

