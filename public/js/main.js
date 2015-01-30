(function(App) {
	'use strict';

	// Main configuration
	requirejs.config({
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
			},
			pagejs: {
				deps: ['history', 'es5Shim']
			}
		}
	});
	
	// Main initialization
	require(['jquery', 'plugins/controllers-manager-2', 'plugins/router'], function($, controllersManager, router) {
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
					console.log('Async experiment!');
					fn(checkInitialization);
				} else {
					console.log('Sync experiment!');
					fn();
					checkInitialization();
				}
			});
		} else {
			start();
		}
				
	});

}(window.NodeShop));