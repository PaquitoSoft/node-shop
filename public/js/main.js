(function() {
	'use strict';

	// Main configuration
	requirejs.config({
		baseUrl: '/js',
		paths: {
			jquery: '/vendor/jquery/dist/jquery.min',
			dust: '/vendor/dustjs-linkedin/dist/dust-full',
			dustHelpers: '/vendor/dustjs-linkedin-helpers/dist/dust-helpers',
			pagejs: '/vendor/page.js/page',
			ractive: '/vendor/ractive/ractive'
		},
		shim: {
			dust: {
				exports: 'dust'
			},
			dustHelpers: {
				deps: ['dust']
			}
		}
	});
	
	// Main initialization
	require(['jquery', 'plugins/controllers-manager', 'plugins/router'], function($, controllersManager, router) {
		controllersManager.config($(document.body), true, function (/*err*/) {
			router.init();
		});
	});

}());