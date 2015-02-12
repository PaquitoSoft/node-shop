(function() {
	'use strict';

	// Client side rendering plugin
	define(
		['plugins/app-context', 'plugins/local-storage', 'jquery', 'ractive'],
		function(appContext, storage, $, R) {

			var cache;
			var cacheLoaded = false;
			var TEMPLATES_BASE_PATH = '/_templates/';
			var TEMPLATES_EXTENSION = '.dust';

			function registerTemplates(templatesData, mainTemplateName) {
				Object.keys(templatesData.partials).forEach(function(partName) {
					R.partials[partName] = templatesData.partials[partName];
				});

				return templatesData.template;
			}

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
				// storeTemplates();
			}

			function preloadTemplate(templateName) {
				if (!cache.templates[templateName]) {
					// TODO Error handling
					$.get(TEMPLATES_BASE_PATH + templateName + TEMPLATES_EXTENSION, function(raw) {
						registerTemplates(raw, templateName);
					});
				}
			}

			function getTemplate(templateName, done) {
				var tpl;

				// if (!cacheLoaded) {
				// 	cache = loadCachedTemplates();
				// 	cacheLoaded = true;
				// }

				// tpl = cache.templates[templateName];

				
				// if (tpl) {
				// 	done(null, tpl);
				// } else {
					// TODO Error handling
					$.get(TEMPLATES_BASE_PATH + templateName + TEMPLATES_EXTENSION, function(raw) {
						var mainTemplate = registerTemplates(raw, templateName);
						done(null, mainTemplate);
					});
				// }
			}

			return {
				preloadTemplate: preloadTemplate,
				getTemplate: getTemplate
			};

		}
	);
}());