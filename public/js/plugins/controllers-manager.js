'use strict';

var $ = require('jquery'),
	dataLayer = require('./data-layer');

		
function config($root, done) {
	var controllers = [],
		mainElements = [],
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
		controllers.push('../controllers/' + $(elem).attr('data-controller'));
		mainElements.push($(elem));
		initData[controllers[index + 1]] = false;
	});

	pendingControllers = controllers.length;

	console.log(controllers);
	// require([], function() {
	// require(controllers, function() {
	$(function() {
		
		$.each(controllers, function(index, controllerName) {
			var controller, controllerData;
			try {
				controller = require(controllerName);
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
		/*setTimeout(function() {
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
		}, 5000);*/
	});

}

module.exports.config = config;
