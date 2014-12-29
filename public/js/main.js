(function() {
	'use strict';

	// Main configuration
	requirejs.config({
		baseUrl: '/js',
		paths: {
			jquery: '/vendor/jquery/dist/jquery.min',
			handlebars: '/vendor/handlebars/handlebars',
			pagejs: '/vendor/page.js/page'
		}
	});
	
	// Main initialization
	require(['jquery', 'plugins/controllers-manager', 'plugins/router'], function($, controllersManager, router) {
		controllersManager.config($(document.body), function (/*err*/) {
			router.init();
		});
	});

}());