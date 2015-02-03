var fs = require('fs'),
	async = require('async'),
	_ = require('underscore'),
	Ractive = require('ractive');

var componentsTemplates = {
	ProductsGrid: './views/partials/products-grid.dust'
};


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

	loadTemplates(function (err, templates) {
		if (err) return done(err);

		// Custom delimiters
		Ractive.defaults.delimiters = ['{-', '-}'];

		// Custom components
		_.each(templates, function (template, componentName) {
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