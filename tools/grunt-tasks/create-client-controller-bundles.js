/*
	Esta tarea se encarga de versionar los assets y modificar las referencias
	a los mismos necesarias.
*/
'use strict';

var /*crypto = require('crypto'),*/
	fs = require('fs'),
	path = require('path'),
	async = require('async'),
	Ractive = require('ractive'),
	cheerio = require('cheerio'),
	_ = require('underscore');/*,
	filewalker = require('filewalker');*/

var _grunt,
	bundlesDirectory;

var templates = {
	components: {
		'products-grid': './views/partials/products-grid.dust',
		'MainLayout': './views/layouts/application.dust'
	}
};

var jsBundleTemplate = "(function() {" +
		"require([dependencies], function() {return {};});" +
	"}());";


function _loadTemplates(partialsPath, done) {
	var fns = {},
		partialsTemplates = {};

	fs.readdirSync(partialsPath).forEach(function(partialName) {
		partialsTemplates['partials/' + partialName.replace(/\.dust$/, '')] = path.join(partialsPath, partialName);
	});
	templates.partials = partialsTemplates;

	_.each(templates, function(group, groupName) {
		_.each(group, function(path, name) {
			fns[groupName + '#' + name] = _.partial(fs.readFile, path, {encoding: 'utf8'});
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

function _setupRactive(templates) {

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
		};
	};
}

function _getViewControllers(viewHtml) {
	var $ = cheerio.load(viewHtml),
		result = {
			plain: [],
			xhr: []
		};
	
	$('[data-controller]').each(function(index, controller) {
		var $controller = $(controller),
			controllerName = $controller.attr('data-controller'),
			controllerType = $controller.attr('data-controller-type');

		result.plain.push("'controllers/" + controllerName + "'");
		if (!controllerType) {
			result.xhr.push("'controllers/" + controllerName + "'");
		}
	});

	return result;
}

function _createJsBundle(bundleName, dependencies) {

	fs.writeFileSync(
		path.join(bundlesDirectory, bundleName + '.js'),
		jsBundleTemplate.replace('dependencies', dependencies.join(','))
	);

}

module.exports = function(grunt) {
	_grunt = grunt;

	grunt.registerMultiTask('createJsBundles', 'Creates client-side controllers bundles.', function() {
		var theEnd = this.async(),
			config = this.data,
			viewsDirectory = path.join(process.cwd(), this.data.viewsPath),
			partialsDirectory = path.join(process.cwd(), this.data.partialsPath);

		bundlesDirectory = path.join(process.cwd(), this.data.destPath);


		grunt.log.writeln("Configuracion para la tarea:", config, '\n\n');

		fs.readdir(viewsDirectory, function(err, files) {
			if (err) return theEnd(err);
			
			console.log('View files:', files);

			_loadTemplates(partialsDirectory, function(err, templates) {
				if (err) return theEnd(err);
		
				_setupRactive(templates);

				// files = [files[2]];

				files.forEach(function(viewFile) {
					var viewName = viewFile.replace(/\.dust$/, ''),
						filePath = path.join(viewsDirectory, viewFile),
						r, $, controllers;
					
					if (!fs.statSync(filePath).isFile()) return false;

					// Compile template
					r = new Ractive({
						template: fs.readFileSync(filePath, {encoding: 'utf8'}),
						data: {},
						stripComments: false // Para no eliminar los condicionales de Internet Explorer
					});
					
					controllers = _getViewControllers(r.toHTML());

					console.log('Controladores para la vista(%s): %s', viewName, JSON.stringify(controllers));

					_createJsBundle(viewName, controllers.plain);
					_createJsBundle(viewName + '_xhr', controllers.xhr);				

				});

				theEnd();
			});

		});

	});

};