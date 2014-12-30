(function() {
	'use strict';

	// Client side rendering plugin
	define(
		['plugins/app-context', 'plugins/local-storage', 'jquery', 'handlebars', 'plugins/handlebars-helpers', 'dust', 'plugins/dust-custom-helpers'],
		function(appContext, storage, $, HBS, viewHelpers, dust, dustHelpers) {

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
							templates = (raw.partials || []).concat([raw.template]);
							templates.forEach(function(t) {
								tpl = dust.compile(t, templateName);
								dust.loadSource(tpl);
							});

							// tpl = dust.compile(raw, templateName);
							// dust.loadSource(tpl);
						}
						done(null, tpl);
						cacheTemplate(templateName, tpl);
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

			// Apply Handlebars custom helpers
			viewHelpers.extendeHandlerbars();
			dustHelpers.registerDustHelpers();

			return {
				preloadTemplate: preloadTemplate,
				render: render
			};

		}
	);
}());