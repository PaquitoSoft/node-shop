(function() {
	'use strict';

	// Controller Manager plugin
	define(['jquery', 'ractive', 'plugins/data-layer', 'plugins/templates'], function($, R, dataLayer, templates) {
		
		function config($root, isBootstrap, done) {
			var controllers = [],
				mainElements = [],
				initialized = false,
				initData = {},
				pendingControllers;
			
			function onControllerInitialized(controllerName) {
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
			}

			function getTemplate(templateName, context, controllerIndex, done) {
				if (!templateName) return done(''); // TODO We still have dummy controllers

				if (isBootstrap) {
					// Get template from plugin
					templates.render(templateName, context, function(tpl) {
						var $tpl = $(tpl).find('[data-controller]');
						if ($tpl.size()) {
							done($tpl.html());
						} else {
							done(tpl);
						}
					});
				} else {
					// Get template from root element
					setTimeout(function() {
						done(mainElements[controllerIndex].html());
					}, 4);
				}
			}

			$root.find('*[data-controller]').each(function(index, elem) {
				controllers.push('controllers/' + $(elem).attr('data-controller'));
				mainElements.push($(elem));
				initData[controllers[index + 1]] = false;
			});

			pendingControllers = controllers.length;

			require(controllers, function() {
				
				$.each(arguments, function(index, controller) {
					var controllerData,
						initializer = isBootstrap ? $(document).ready : function(fn) { fn.call(); },
						$mainElement = mainElements[index];

					try {
						console.log('Initializing controller:', $mainElement.attr('data-controller'));
						controllerData = dataLayer[$mainElement.attr('data-controller')] || {};

						getTemplate(controller.templateName, controllerData, index, function(template) {
							var synchronizer;

							if (controller.setup) {
								controllerData = controller.setup($mainElement, controllerData) || controllerData;
							}
							
							initializer(function() {

								// TODO We still have controllers with no template bindings
								if (template) {
									synchronizer = new R({
										el: $mainElement[0],
										template: template,
										data: controllerData,
										delimiters: ['{-', '-}']
									});
								}

								if (controller.init.length > 3) {
									controller.init($mainElement, controllerData, synchronizer, $.proxy(onControllerInitialized, controllers[index]));
								} else {
									controller.init($mainElement, controllerData, synchronizer);
									onControllerInitialized(controllers[index]);
								}
							});

						});
						
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