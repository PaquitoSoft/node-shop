(function() {
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
			ractive: '/vendor/ractive/ractive-legacy'
		},
		shim: {
			dust: {
				exports: 'dust'
			},
			dustHelpers: {
				deps: ['dust']
			},
			pagejs: {
				deps: ['history']
			}
		}
	});
	
	// Main initialization
	require(['jquery', 'plugins/controllers-manager', 'plugins/router'], function($, controllersManager, router) {
		
		// Hack for IE8
		if(!Array.isArray) {
			Array.isArray = function (vArg) {
				return Object.prototype.toString.call(vArg) === "[object Array]";
			};
		}

		$.each(window.NodeShop.extensions, function (index, fn) {
			fn(controllersManager, router);
		});

		controllersManager.config($(document), true, function (/*err*/) {
			router.init();
		});
	});

}());