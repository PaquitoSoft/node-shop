(function() {
	'use strict';

	// Main configuration
	requirejs.config({
		baseUrl: '/js',
		paths: {
			jquery: '/vendor/jquery/dist/jquery',
		}
	});
	
	// Main initialization
	require(['jquery', 'plugins/dom'], function($, dom) {
		var controllers = [],
			mainElements = [];
		
		$('*[data-controller]').each(function(index, elem) {
			controllers.push('controllers/' + $(elem).attr('data-controller'));
			mainElements.push($(elem));
		});

		require(controllers, function() {
			$.each(arguments, function(index, controller) {
				try {
					controller.init(mainElements[index]);
				} catch (e) {
					console.log('Error initializing controller %s: %s', controller, e);
					console.log(e.stack);
				}
			});
		});
	});

}());