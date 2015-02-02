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
			es5Shim: '/vendor/es5-shim/es5-shim'
		},
		shim: {
			dust: {
				exports: 'dust'
			},
			dustHelpers: {
				deps: ['dust']
			}
		}
	};

	// Bootstrap dependencies
	mainDependencies = ['jquery', 'plugins/controllers-manager-2', 'plugins/router'];

	// Is this an old browser? -- TODO We need to decide what condition is enough for us
	if (!Array.isArray) {
		mainDependencies.push('es5Shim', 'history');
		requireOptions.paths.jquery = '/vendor/jquery-legacy/dist/jquery';
	} else {
		requireOptions.paths.jquery = '/vendor/jquery-modern/dist/jquery';
	}

	// Configure RequireJS
	requirejs.config(requireOptions);
	
	// Main initialization
	require(mainDependencies, function($, controllersManager, router) {
		var counter = App.extensions.length;

		function start() {
			controllersManager.config($(document), true, function (/*err*/) {
				router.init();
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