(function(App) {
	'use strict';

	var mainDependencies,
		requireOptions;

	// Main configuration
	requireOptions = {
		baseUrl: '/js',
		paths: {
			templates: '/templates',
			text: '/vendor/requirejs-text/text',
			jquery: '/vendor/jquery/dist/jquery',
			pagejs: '/vendor/page.js/page',
			history: '/vendor/html5-history-api/history.iegte8',
			ractive: '/vendor/ractive/ractive-legacy',
			es5Shim: '/vendor/es5-shim/es5-shim'
		},
		shim: {
			/*,
			ractive: {
				deps: ['plugins/ractive-view-helpers']
			}*/
		}
	};

	// Main dependencies
	mainDependencies = ['jquery', 'plugins/controllers-manager-2', 'plugins/router', 'plugins/data-layer', 'plugins/events-manager'];

	// Is this an old browser?
	if (!Array.isArray) {
		mainDependencies.push('es5Shim', 'history');
		requireOptions.paths.jquery = '/vendor/jquery-legacy/dist/jquery';
		requireOptions.paths.ractive = '/vendor/ractive/ractive-legacy';
	} else {
		requireOptions.paths.jquery = '/vendor/jquery-modern/dist/jquery';
		requireOptions.paths.ractive = '/vendor/ractive/ractive';
	}

	// Configure RequireJS
	requirejs.config(requireOptions);
	
	// Main initialization
	define('main', mainDependencies, function($, controllersManager, router, dataLayer, events) {
		var counter = App.extensions.length;

		function startApp() {
			// TODO Get dataLayer from a plugin
			controllersManager.config($(document), window.location.pathname, dataLayer, {
				isBootstrap: true,
				done: function() {
					router.init({
						viewName: dataLayer.template,
						serverData: dataLayer
					});
					events.trigger('APP_INITIALIZED');
				}
			});
		}

		function checkInitialization() {
			if (!--counter) {
				startApp();
			}
		}
		
		return {
			start: function() {
				events.trigger('APP_INITIALIZING');
				if (counter) {
					App.extensions.forEach(function(fn) {
						if (fn.length > 0) {
							fn(checkInitialization);
						} else {
							fn();
							checkInitialization();
						}
					});
				} else {
					startApp();
				}
			}
		};
	});

}(window.NodeShop));