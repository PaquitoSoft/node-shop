'use strict';

// Client side rendering plugin

var $ = require('jquery'),
	HBS = require('handlebars'),
	dust = require('dustjs'),
	appContext = require('./app-context'),
	storage = require('./local-storage'),
	viewHelpers = require('./handlebars-helpers'),
	dustHelpers = require('./dust-custom-helpers');

// var MODE = 'HBS';
var MODE = 'dust';

var cache;
var cacheLoaded = false;
var TEMPLATES_BASE_PATH = (MODE === 'HBS') ? '/js/templates/' : '/_templates/';
var TEMPLATES_EXTENSION = (MODE === 'HBS') ? '.hbs' : '.dust';
// var TEMPLATES_BASE_PATH = '/_templates/';

function loadCachedTemplates() {
	var templatesData = storage.retrieve('templatesData'),
		result = {version: '', templates: {}};

	if (templatesData) {
		if (templatesData.version === appContext.version) {
			result = templatesData;
		} else {
			result.version = appContext.version;
			setTimeout(function() {
				storage.remove('templatesData');
			}, 4);
		}
	}

	return result;
}

function storeTemplates() {
	if (!appContext.templates.disableCaching) {
		setTimeout(function() {
			storage.store('templatesData', cache);
		}, 4);
	}
}

function cacheTemplate(templateName, tpl) {
	cache.templates[templateName] = tpl;
	storeTemplates();
}

function preloadTemplate(templateName) {
	if (!cache.templates[templateName]) {
		// TODO Error handling
		$.get(TEMPLATES_BASE_PATH + templateName + TEMPLATES_EXTENSION, function(raw) {
			cacheTemplate(templateName, HBS.compile(raw));
		});
	}
}

function getTemplate(templateName, done) {
	var tpl;

	if (!cacheLoaded) {
		cache = loadCachedTemplates();
		cacheLoaded = true;
	}

	tpl = cache.templates[templateName];

	if (tpl) {
		done(null, tpl);
	} else {
		// TODO Error handling
		$.get(TEMPLATES_BASE_PATH + templateName + TEMPLATES_EXTENSION, function(raw) {
			var data, templates;
			if (MODE === 'HBS') {
				tpl = HBS.compile(raw);
			} else {
				console.info('Compiling dust template:', templateName);
				
				tpl = dust.compile(raw.template, templateName);
				dust.loadSource(tpl);

				Object.keys(raw.partials).forEach(function(partName) {
					tpl = dust.compile(raw.partials[partName], partName);
					dust.loadSource(tpl);
				});
			}
			done(null, tpl);
			// TODO Cache response
			// cacheTemplate(templateName, tpl);
		});
	}
}

function render(templateName, context, done) {
	getTemplate(templateName, function(err, tpl) {
		// TODO Error handling
		if (MODE === 'HBS') {
			done(tpl(context));
		} else {
			dust.render(templateName, context, function (err, html) {
				if (err) {
					console.warn('Error rendering template ', templateName, ':', err);
					console.warn(err.stack);
				}
				done(html);
			});
		}
	});
}

// Apply custom helpers
viewHelpers.extendeHandlerbars();
dustHelpers.registerDustHelpers();

module.exports = {
	preloadTemplate: preloadTemplate,
	render: render
};

