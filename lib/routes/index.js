'use strict';

var async = require('async'),
	fs = require('fs'),
	async = require('async'),
	catalogRouter = require('./catalog'),
	shopRouter = require('./shop'),
	middleware = require('../middleware'),
	models = require('../models');

module.exports.configure = function(app) {

	var templatesCache = {};
	var DUST_CONTENT_REGEXP = /\{<\s*mainContent\}([^]*)\{\/\s?mainContent\}/;
	// var DUST_PARTIALS_REGEXP = /\{>\s?"(.*)".*\/\}/g;
	var DUST_PARTIALS_REGEXP = /\{>\s?"([\w-\/]*)"[^\}]*\/\}/g;

	// TODO This should be recursive
	function getPartials(templateContent, done) {
		var partials = DUST_PARTIALS_REGEXP.exec(templateContent),
			nestedPartials = [],
			result = [],
			i, len;

		if (partials) {
			console.log('------------> ', partials);
			async.each(partials[1], function(part, next) {
				fs.readFile(__dirname + '/../../views/' + part + '.dust', { encoding: 'utf8' }, function (err, content) {
					if (err) return next(err);
					result.push({
						name: part,
						content: content
					});
				});
			}, function (err) {
				done(err, result);
			});

		} else {
			process.nextTick(function() {
				done(null, []);
			});
		}
	}

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
					var result;
					if (err) return next(err);
					try {
						tpl = DUST_CONTENT_REGEXP.exec(data);
						
						if (tpl) {
							result = {
								template: tpl[1]
							};

							getPartials(result.template, function(err, partials) {
								if (err) return next(err);

								if (partials.length) {
									result.partials = partials;
								}
								
								res.json(result);
								// templatesCache[req.params.templatePath] = result;	
							});
							
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

