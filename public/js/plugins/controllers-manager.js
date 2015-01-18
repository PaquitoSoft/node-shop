(function() {
	'use strict';

	// Controller Manager plugin
	define(['jquery', 'ractive', 'plugins/data-layer', 'plugins/templates', 'plugins/decorators/image-lazy-load'], function($, R, dataLayer, templates) {
		var persistentControllers = [];

		function config($root, isBootstrap, done) {
			var controllers = [],
				dependencies = [],
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

			function getTemplate(controller, controllerInfo, controllerData, done) {
				if (!controller.templateName) return done('', controller, controllerInfo, controllerData); // TODO We still have dummy controllers
				if (isBootstrap) {
					// Get template from plugin
					templates.render(controller.templateName, controllerData, function(tpl) {
						try {
							var $tpl = $(tpl);
							$tpl = $tpl.data('controller') ? $tpl : $tpl.find('[data-controller]');

							if ($tpl.size()) {
								done($tpl.html(), controller, controllerInfo, controllerData);
							} else {
								done(tpl, controller, controllerInfo, controllerData);
							}
						} catch (e) { // Problem with document title template (no html)
							done(tpl, controller, controllerInfo, controllerData);
						}
						
					});
				} else {
					// Get template from root element
					setTimeout(function() {
						// done(mainElements[controllerIndex].html(), controllerIndex, $el);
						// done(controllers[controllerIndex].$mainEl.html(), controllerIndex, $el);
						done(controllerInfo.$mainEl.html(), controller, controllerInfo, controllerData);
					}, 4);
				}
			}

			$root.find('*[data-controller]').each(function(index, elem) {
				var $controller = $(elem),
					controllerName = $controller.attr('data-controller'),
					isPersistent = !!$controller.data('persistent-controller'),
					// controllersGroup = isPersistent ? persistentControllers : controllers;
					cont = {
						name: controllerName,
						$mainEl: $controller,
						isPersistent: $controller.data('persistent-controller')
					};

				if (isPersistent) {
					if (!~$.inArray(cont, persistentControllers)) {
						persistentControllers.push(cont);
					// } else {
						// Si es persistente y ya esta en el array no hago nada
						// porque se añadirá automáticamente en la siguiente instrucción
					}
				} else {
					controllers.push(cont);
					dependencies.push('controllers/' + controllerName);
				}

				// if ($controller.data('persistent-controller')) {
				// 	persistentControllers['controllers/' + controllerName] = $controller;
				// } else {
				// 	controllers.push('controllers/' + controllerName);
				// 	mainElements.push($controller);
				// 	initData[controllers[index + 1]] = false;
				// }
				
			});

			$.each(persistentControllers, function(index, controllerInfo) {
				controllers.push(controllerInfo);
				dependencies.push('controllers/' + controllerInfo.name);
				// initData[controllers[controllers.length]] = false;
			});

			pendingControllers = controllers.length;

			require(dependencies, function() {
				
				$.each(arguments, function(index, controller) {
					var controllerData,
						controllerInfo = controllers[index];

					try {
						// console.log('1.- Initializing controller:', $mainElement.attr('data-controller'));
						controllerData = dataLayer[controllerInfo.name] || {};

						getTemplate(controller, controllerInfo, controllerData, function(template, cont, info, data) {
							var synchronizer;

							if (cont.setup) {
								data = cont.setup(info.$mainEl, data) || data;
							}

							// TODO We still have controllers with no template bindings
							if (template) {
								if (controllerInfo.isPersistent && !isBootstrap) {
									controllerInfo.synchronizer.set(data);
									onControllerInitialized(cont);
									return false;
								} else {
									synchronizer = new R({
										el: info.$mainEl[0],
										template: template,
										data: data,
										delimiters: ['{-', '-}']
									});
									if (controllerInfo.isPersistent) {
										persistentControllers[$.inArray(controllerInfo, persistentControllers)].synchronizer = synchronizer;
									}
								}
							}

							if (controller.init.length > 3) {
								controller.init(info.$mainEl, data, synchronizer, $.proxy(onControllerInitialized, cont));
							} else {
								controller.init(info.$mainEl, data, synchronizer);
								onControllerInitialized(cont);
							}
						});

						// getTemplate(controller.templateName, controllerData, index, controllerInfo.$mainEl, function(template, controllerIndex, $el) {
						// 	var synchronizer;

						// 	if (controller.setup) {
						// 		controllerData = controller.setup($el, controllerData) || controllerData;
						// 	}

						// 	// TODO We still have controllers with no template bindings
						// 	if (template) {
						// 		synchronizer = new R({
						// 			el: $el[0],
						// 			template: template,
						// 			data: controllerData,
						// 			delimiters: ['{-', '-}']
						// 		});
						// 	}

						// 	if (controller.init.length > 3) {
						// 		controller.init($el, controllerData, synchronizer, $.proxy(onControllerInitialized, controllers[controllerIndex]));
						// 	} else {
						// 		controller.init($el, controllerData, synchronizer);
						// 		onControllerInitialized(controllers[controllerIndex]);
						// 	}

						// });
						
					} catch (e) {
						console.log('Error initializing controller %s: %s', controller, e);
						console.log(e.stack);
					}
				});

				// We have a timeout warning if some controller gets stuck
				//	or someone included callback but forgot to call it
				// setTimeout(function() {
				// 	var err;
				// 	if (!initialized) {
				// 		err = new Error('Controller initialization timeout!');
				// 		err.pendingControllers = controllers.filter(function(controllerName) {
				// 			return !initData[controllerName];
				// 		});
				// 		console.warn(err);
				// 		console.warn('Pending controllers:', err.pendingControllers);
				// 		if (done) {
				// 			done(err);
				// 		}
				// 	}
				// }, 2500);
			});

		}

		return {
			config: config
		};
	});
}());