(function() {
	'use strict';

	// Controller Manager plugin
	define(['jquery'/*, 'plugins/router'*/], function($/*, Router*/) {
		
		function config($root, done) {
			// TODO Initialize html controllers
		
			var controllers = [],
				mainElements = [],
				dataLayer = window.NodeShop.dataLayer, // TODO Improve this!
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
					console.log('ALL Controllers han been fully initialized!');
					if (done) {
						done();
					}
				}
			};

			$root.find('*[data-controller]').each(function(index, elem) {
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
					var err;
					if (!initialized) {
						err = new Error('Controller initialization timeout!');
						err.pendingControllers = controllers.filter(function(controllerName) {
							return !initData[controllerName];
						});
						console.warn(err);
						console.warn('Pending controllers:', err.pendingControllers);
						if (done) {
							done(err);
						}
					}
				}, 5000);
			});

		}

		return {
			config: config
		};
	});
}());