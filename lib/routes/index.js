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
	var DUST_PARTIALS_REGEXP = /\{>\s?"([\w-\/]*)"[^\}]*\/\}/g;

	// TODO This should be recursive
	function getPartials(templateContent, done) {

		var r = /\{>\s?"([\w-\/]*)"[^\}]*\/\}/g,
			parts,
			partials = [],
			result = {};

		while ((parts = r.exec(templateContent)) !== null) {
			partials.push(parts[1]);
		}

		if (partials.length) {
			async.each(partials, function(part, next) {
				fs.readFile(__dirname + '/../../views/' + part + '.dust', { encoding: 'utf8' }, function (err, content) {
					if (err) return next(err);
					
					result[part] = content;
					next();
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

	app.get('/_templates/*', function(req, res, next) {
		var tpl, partials,
			templatePath = req.params[0],
			isPartial = !/partials/.test(templatePath);
		
		if (templatePath) {
			tpl = templatesCache[templatePath];
			if (tpl) {
				console.log('Sending cached template...');
				res.send(tpl);
			} else {
				fs.readFile(__dirname + '/../../views/' + templatePath, {encoding: 'utf8'}, function(err, data) {
					var result;
					
					if (err) return next(err);

					if (isPartial) {
						tpl = DUST_CONTENT_REGEXP.exec(data);
						if (tpl) {
							tpl = tpl[1];
						} else {
							return res.status(412).send('Could not pre-process template');	
						}
					} else {
						tpl = data;
					}
					
					getPartials(tpl, function(err, partials) {
						var result;

						if (err) return next(err);

						result = {
							template: tpl,
							partials: partials
						};

						res.json(result);

						// TODO cache response (depends on environment)
						// templatesCache[templatePath] = result;
					});
				
				});
			}
		} else {
			return next();
		}
	});

	app.use('/catalog', catalogRouter);
	app.use('/shop', shopRouter);
};
