(function() {
	'use strict';

	// Main configuration
	requirejs.config({
		baseUrl: '/js',
		paths: {
			jquery: '/vendor/jquery/dist/jquery.min',
			handlebars: '/vendor/handlebars/handlebars',
			dust: '/vendor/dustjs-linkedin/dist/dust-full',
			dustHelpers: '/vendor/dustjs-linkedin-helpers/dist/dust-helpers',
			pagejs: '/vendor/page.js/page'
		},
		shim: {
			dust: {
				exports: 'dust'
			}
		}
	});
	
	// Main initialization
	require(['jquery', 'plugins/controllers-manager', 'plugins/router'], function($, controllersManager, router) {
		controllersManager.config($(document.body), function (/*err*/) {
			router.init();
		});
	});

}());