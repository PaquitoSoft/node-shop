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
	require(['jquery'], function($) {
		var controllers = [],
			mainElements = [],
			onControllerInitialized,
			pendingControllers;
		
		onControllerInitialized = function() {
			if (pendingControllers > 1) {
				pendingControllers--;
			} else {
				console.log('ALL Controllers han been fully initialized!');
			}
		}

		$('*[data-controller]').each(function(index, elem) {
			controllers.push('controllers/' + $(elem).attr('data-controller'));
			mainElements.push($(elem));
		});

		pendingControllers = controllers.length;

		require(controllers, function() {
			
			$.each(arguments, function(index, controller) {
				try {
					if (controller.init.length > 1) {
						controller.init(mainElements[index], onControllerInitialized);
					} else {
						controller.init(mainElements[index]);
						onControllerInitialized();
					}
					// TODO Maybe we should have a timeout warning if some controller gets stuck
					//		or someone included callback but forgot to call it
				} catch (e) {
					console.log('Error initializing controller %s: %s', controller, e);
					console.log(e.stack);
				}
			});
		});
	});

}());