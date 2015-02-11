var fs = require('fs'),
	async = require('async'),
	_ = require('underscore'),
	consolidate = require('consolidate'),
	cheerio = require('cheerio'),
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

// TODO Using this approach means that every time we change a template, we must 
// restart the server as Ractive singleton would have stored partials and components
// since the server was first started
function configure(done) {

	// TODO Do nothing if we have already loaded templates if we're
	// not in a development environment

	_loadTemplates(function (err, templates) {
		if (err) return done(err);

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

function configure2(done) {
	var result = {
		partials: {},
		components: {},
		decorators: {}
	};

	// TODO Do nothing if we have already loaded templates if we're
	// not in a development environment

	_loadTemplates(function (err, templates) {
		if (err) return done(err);

		// Custom partials
		result.partials = templates.partials;

		// Custom components
		_.each(templates.components, function (template, componentName) {
			// console.log('Loading component', componentName, ':', template);
			result.components[componentName] = Ractive.extend({
				template: template
			});
		});

		
		// Custom decorators
		result.decorators.imageLazyLoader = function() {
			return {
				teardown: function() {}
			}
		};

		done(null, result);
	});

}



var jsBundleTemplate = "(function() {" +
	"require([${dependencies}], function() {return {};});" +
"}());";

var bundlesRegistry = {};

function createJsBundle(bundleName, html, done) {
	var $ = cheerio.load(html),
		dependencies = [],
		$controllers;

	if (bundlesRegistry[bundleName]) return done();

	$controllers = $('[data-controller]');

	$controllers.each(function(index, controller) {
		dependencies.push("'controllers/" + $(controller).attr('data-controller') + "'");
	});

	fs.writeFile(process.cwd() + '/public/js/bundles/' + bundleName + '.js',
		jsBundleTemplate.replace(/\$\{dependencies\}/, dependencies.join(',')),
		{ encoding: 'utf8', flag: 'w'},
		function(err) {
			if (err) return done(err);
			bundlesRegistry[bundleName] = true;
			done();
		});
}

function render2(str, options, done) {
	var view = this;
	debugger;
	
	async.waterfall([
		function loadTemplate(next) {
			// TODO Cache template
			fs.readFile(str, {encoding: 'utf8'}, next);
		},
		function loadComponents(template, next) {
			// TODO Only in development environments
			configure2(function (err, components) {
				next(err, template, components);
			});
		},
		function renderTemplate(template, components, next) {
			// TODO components depend on environment
			var r = new Ractive({
				template: template,
				data: options,
				partials: components.partials,
				components: components.components,
				decorators: components.decorators,
				stripComments: false // Para no eliminar los condicionales de Internet Explorer
			});
			next(null, r.toHTML());
		},
		function createJsBundles(html, next) {
			// TODO Only in development environments
			createJsBundle(view.name, html, function(err) {
				if (err) {
					// TODO Should this raise an error? Maybe client can handle bundle not
					// existing and fallback to load controllers
					console.warn('Could not create JS bundles for view:', view.name);
				}
				next(null, html);
			});
		}
	], done);
	
};


// TODO Configure on startup time for production modes

module.exports.config = configure;
module.exports.render = render;
