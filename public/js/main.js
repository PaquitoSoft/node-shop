(function(App) {
	'use strict';

	var mainDependencies,
		requireOptions;

	// Main configuration
	requireOptions = {
		baseUrl: '/js',
		paths: {
			jquery: '/vendor/jquery/dist/jquery',
			dust: '/vendor/dustjs-linkedin/dist/dust-full',
			dustHelpers: '/vendor/dustjs-linkedin-helpers/dist/dust-helpers',
			pagejs: '/vendor/page.js/page',
			history: '/vendor/html5-history-api/history.iegte8',
			ractive: '/vendor/ractive/ractive-legacy',
			es5Shim: '/vendor/es5-shim/es5-shim',
			html5shiv: '/vendor/html5shiv/dist/html5shiv'
		},
		shim: {
			dust: {
				exports: 'dust'
			},
			dustHelpers: {
				deps: ['dust']
			}/*,
			ractive: {
				deps: ['plugins/ractive-view-helpers']
			}*/
		}
	};

	// Bootstrap dependencies
	mainDependencies = ['jquery', 'plugins/controllers-manager-2', 'plugins/router'];

	// Is this an old browser?
	if (!Array.isArray) {
		mainDependencies.push('es5Shim', 'history', 'html5shiv');
		requireOptions.paths.jquery = '/vendor/jquery-legacy/dist/jquery';
		requireOptions.paths.ractive = '/vendor/ractive/ractive-legacy';
	} else {
		requireOptions.paths.jquery = '/vendor/jquery-modern/dist/jquery';
		requireOptions.paths.ractive = '/vendor/ractive/ractive';
	}

	// Configure RequireJS
	requirejs.config(requireOptions);
	
	// Main initialization
	require(mainDependencies, function($, controllersManager, router) {
		var counter = App.extensions.length;

		function start() {
			// TODO Get dataLayer from a plugin
			controllersManager.config($(document), window.NodeShop._dataLayer, {
				isBootstrap: true,
				done: function() {
					router.init();
				}
			});
		}

		function checkInitialization() {
			if (!--counter) {
				start();
			}
		}

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
			start();
		}
				
	});

}(window.NodeShop));