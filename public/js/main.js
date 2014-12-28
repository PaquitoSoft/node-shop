(function() {
	'use strict';

	// Main configuration
	requirejs.config({
		baseUrl: '/js',
		paths: {
			jquery: '/vendor/jquery/dist/jquery.min',
			handlebars: '/vendor/handlebars/handlebars.min',
			pagejs: '/vendor/page.js/page'
		}
	});
	
	// Main initialization
	require(['jquery'], function($) {
		var controllers = [],
			mainElements = [],
			dataLayer = window.NodeShop.dataLayer,
			initialized = false,
			initData = {},
			onControllerInitialized,
			pendingControllers;
		
		onControllerInitialized = function(controllerName) {
			initData[controllerName] = true;

			if (pendingControllers > 1) {
				pendingControllers--;
			} else {
				initialized = true;
				require(['plugins/router'], function (Router) {
					console.log('ALL Controllers han been fully initialized!');
					Router.init();
				});
			}
		}

		$('*[data-controller]').each(function(index, elem) {
			controllers.push('controllers/' + $(elem).attr('data-controller'));
			mainElements.push($(elem));
			initData[controllers[index + 1]] = false;
		});

		pendingControllers = controllers.length;

		require(controllers, function() {
			
			$.each(arguments, function(index, controller) {
				var controllerData;
				try {
					controllerData = dataLayer[mainElements[index].attr('data-controller')] || {};
					if (controller.init.length > 2) {
						controller.init(mainElements[index], controllerData, $.proxy(onControllerInitialized, controllers[index]));
					} else {
						controller.init(mainElements[index], controllerData);
						onControllerInitialized(controllers[index]);
					}
				} catch (e) {
					console.log('Error initializing controller %s: %s', controller, e);
					console.log(e.stack);
				}				
			});

			// We have a timeout warning if some controller gets stuck
			//	or someone included callback but forgot to call it
			setTimeout(function() {
				if (!initialized) {
					console.warn('Controller initialization timeout!');
					console.warn('Pending controllers:', controllers.filter(function(controllerName) {
						return !initData[controllerName];
					}))
				}
			}, 5000);
		});
	});

}());