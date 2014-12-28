(function() {
	'use strict';

	// Client side rendering plugin
	define(
		['plugins/app-context', 'plugins/local-storage', 'jquery', 'handlebars', 'plugins/handlebars-helpers'],
		function(appContext, storage, $, HBS, viewHelpers) {

			var cache;
			var cacheLoaded = false;
			var TEMPLATES_BASE_PATH = '/js/templates/';

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
					$.get(TEMPLATES_BASE_PATH + templateName + '.hbs', function(raw) {
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
					$.get(TEMPLATES_BASE_PATH + templateName + '.hbs', function(raw) {
						tpl = HBS.compile(raw);
						done(null, tpl);
						cacheTemplate(templateName, tpl);
					});
				}
			}

			function render(templateName, context, done) {
				getTemplate(templateName, function(err, tpl) {
					// TODO Error handling
					done(tpl(context));
				});
			}

			// Apply Handlebars custom helpers
			viewHelpers.extendeHandlerbars();

			return {
				preloadTemplate: preloadTemplate,
				render: render
			}

		}
	);
}());