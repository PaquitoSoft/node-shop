(function() {
	'use strict';

	// Main configuration
	requirejs.config({
		baseUrl: '/js',
		paths: {
			jquery: '/vendor/jquery/dist/jquery',
			handlebars: '/vendor/handlebars/handlebars',
			es5Shim: '/vendor/es5-shim/es5-shim.min'
		}
	});
	
	var mainModules = ['jquery'];

	if (!Array.prototype.indexOf) {
		mainModules.push('es5Shim');
	}

	// Main initialization
	require(mainModules, function($) {
		var controllers = [],
			mainElements = [],
			dataLayer = window.NodeShop.dataLayer,
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
				var controllerData;
				try {
					controllerData = dataLayer[mainElements[index].attr('data-controller')] || {};
					if (controller.init.length > 1) {
						controller.init(mainElements[index], controllerData, onControllerInitialized);
					} else {
						controller.init(mainElements[index], controllerData);
						onControllerInitialized();
					}
					// TODO Maybe we should have a timeout warning if some controller gets stuck
					//		or someone included callback but forgot to call it
				} catch (e) {
					console.log('Error initializing controller %s: %s', mainElements[index].attr('data-controller'), e);
					console.log(e.stack);
					throw e;
				}
			});
		});
	});

}());