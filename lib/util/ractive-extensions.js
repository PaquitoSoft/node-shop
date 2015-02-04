var fs = require('fs'),
	async = require('async'),
	_ = require('underscore'),
	Ractive = require('ractive');

var componentsTemplates = {
	ProductsGrid: './views/partials/products-grid.dust',
	MainLayout: './views/layouts/application.dust'
};

var templates = {
	partials: { // TODO Autoload all partials
		'partials/mini-shop-cart-items': './views/partials/mini-shop-cart-items.dust',		
		'partials/mini-cart': './views/partials/mini-cart.dust',
		'partials/main-banner': './views/partials/main-banner.dust',
		'partials/navigation-menu': './views/partials/navigation-menu.dust'
	},
	components: {
		'products-grid': './views/partials/products-grid.dust',
		MainLayout: './views/layouts/application.dust'
	}
};

function _loadTemplates(done) {
	var fns = {};
	console.log("Let's load the templates...");

	_.each(templates, function(group, groupName) {
		_.each(group, function(path, name) {
			fns[groupName + '#' + name] = _.partial(fs.readFile, path, {encoding: 'utf8'})
		});
	});

	async.parallel(fns, function(err, results) {
		var result = {};
		if (err) { return done(err); }

		_.each(results, function(template, name) {
			var tokens = name.split('#');
			result[tokens[0]] = result[tokens[0]] || {};
			result[tokens[0]][tokens[1]] = template;
		});

		done(null, result);
	});
}

function loadTemplates(done) {
	var fns = {};
	console.log("Let's load the templates...");
	_.each(componentsTemplates, function(path, name) {
		fns[name] = function(next) {
			fs.readFile(path, { encoding: 'utf8' }, next);
		};
	});
	async.parallel(fns, done);
}

function configure(done) {

	_loadTemplates(function (err, templates) {
		if (err) return done(err);

		// Custom delimiters
		// Ractive.defaults.delimiters = ['{-', '-}'];

		// Custom partials
		_.each(templates.partials, function (template, partialName) {
			// console.log('Loading partial', partialName, ':', template);
			Ractive.partials[partialName] = template;
		});

		// Custom components
		_.each(templates.components, function (template, componentName) {
			// console.log('Loading component', componentName, ':', template);
			Ractive.components[componentName] = Ractive.extend({
				template: template
			});
		});
		
		// Custom decorators
		Ractive.decorators.imageLazyLoader = function() {
			return {
				teardown: function() {}
			}
		};

		done();
	});

}

module.exports.config = configure;