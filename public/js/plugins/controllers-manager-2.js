(function() {
	'use strict';
	window.myRegistry = {};
	// Controller Manager plugin
	define(['jquery', 'ractive', 'plugins/data-layer', 'plugins/templates', 'plugins/decorators/image-lazy-load'], function($, R, dataLayer, templates) {

		var controllersRegistry = {};

		function _getTemplate(templateName, $controllerMainEl, isBootstrap, done) {
			if (!templateName) { return done(''); } // TODO We still have dummy controllers
			
			if (isBootstrap) {
				// Get template from plugin
				templates.render(templateName, function(tpl) {
					var $tpl = $(tpl);
					$tpl = $tpl.data('controller') ? $tpl : $tpl.find('[data-controller]');

					if ($tpl.size()) {
						done($tpl.html());
					} else {
						done(tpl);
					}
				});
			} else {
				// Get template from root element
				setTimeout(function() {
					done($controllerMainEl.html());
				}, 4);
			}
		}

		function config($root, isBootstrap, done) {
			var controllersInfo = [],
				dependencies = [];
		
			// Find which controllers we need to manage
			$root.find('*[data-controller]').each(function(index, elem) {
				var $el = $(elem),
					controllerName = $el.attr('data-controller'),
					isPersistent = !!$el.data('persistent-controller'),
					cont = {
						name: controllerName,
						$mainEl: $el,
						isPersistent: $el.data('persistent-controller')
					};

				controllersInfo.push(cont);
				dependencies.push('controllers/' + controllerName);
			});

			// Require all controllers at once
			require(dependencies, function() {
				
				$.each(arguments, function(index, Controller) {
					var controllerInfo = controllerInfo[index],
						controllerData = dataLayer[controllerInfo.name] || {},
						instance;

					if (!controllersRegistry[controllerInfo.name]) {

						// TODO Create controller
						instance = new Controller(controllerInfo.$mainEl, controllerData, controllerInfo.isPersistent);

						instance.setup();

						_getTemplate(instance.templateName, controllerInfo.$mainEl, isBootstrap, function(tpl) {

							instance.start(new R({
									controllerName: controllerInfo.name,
									el: controllerInfo.$mainEl[0],
									template: tpl,
									data: controllerData,
									delimiters: ['{-', '-}']
								}), function () {
									// TODO Check this controller as handled
									// controllerInitialized(controllerInfo.name);

									controllersRegistry[controllerInfo.name] = instance;
								}
							);

						});

					} else {

						// TODO Update existing controller
						controllersRegistry[controllerInfo.name].update(controllerData, controllerInfo.$mainEl);
					}

					// TODO Teardown unused controllers???
				});
			});

		}






		var persistentControllers = [],
			controllersInterceptors = {};

		function registerInterceptor(controllerName, interceptor) {
			// var prev = controllersInterceptors[controllerName] || [];
			// prev.push(interceptor);
			// controllersInterceptors[controllerName] = prev;

			controllersInterceptors[controllerName] = interceptor;
		}

		function removeInterceptor(controllerName, interceptor) {
			// var prev = controllersInterceptors[controllerName] || [],
			// 	index = $.inArray(interceptor, prev);

			// if (~index) {
			// 	prev.splice(index, 1);
			// 	controllersInterceptors = prev;
			// }

			controllersInterceptors[controllerName] = undefined;
		}

		function config($root, isBootstrap, done) {
			var controllers = [],
				dependencies = [],
				mainElements = [],
				initialized = false,
				initData = {},
				pendingControllers;
			
			function onControllerInitialized(/*controllerName*/ controllerInfo) {
				// initData[controllerInfoName] = true;
				if (controllerInfo.onInitialized) {
					controllerInfo.onInitialized(controllerInfo.sync);
				}

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
						done(controllerInfo.$mainEl.html(), controller, controllerInfo, controllerData);
					}, 4);
				}
			}

			$root.find('*[data-controller]').each(function(index, elem) {
				var $controller = $(elem),
					controllerName = $controller.attr('data-controller'),
					isPersistent = !!$controller.data('persistent-controller'),
					cont = {
						name: controllerName,
						$mainEl: $controller,
						isPersistent: $controller.data('persistent-controller')
					};

				if (isPersistent) {
					if (!~$.inArray(cont, persistentControllers)) {
						persistentControllers.push(cont);
					}
				} else {
					controllers.push(cont);
					dependencies.push('controllers/' + controllerName);
				}

			});

			$.each(persistentControllers, function(index, controllerInfo) {
				controllers.push(controllerInfo);
				dependencies.push('controllers/' + controllerInfo.name);
			});

			pendingControllers = controllers.length;

			require(dependencies, function() {
				
				$.each(arguments, function(index, controller) {
					var controllerData,
						controllerInfo = controllers[index];

					try {
						// console.log('1.- Initializing controller:', $mainElement.attr('data-controller'));
						var miniCartController;
						controllerData = dataLayer[controllerInfo.name] || {};

						if (controllerInfo.name === 'product-detail-controller') {
							controller = miniCartController = new controller(controllerInfo.$mainEl, controllerData);
						}

						getTemplate(controller, controllerInfo, controllerData, function(template, cont, info, data) {
							var synchronizer, interceptor, interceptionResult;


							if (controllerInfo.name === 'product-detail-controller') {
								// miniCartController = new controller(info.$mainEl, data);
								miniCartController.setup();
								miniCartController.start(new R({
										controllerName: cont.name,
										el: info.$mainEl[0],
										template: template,
										data: data,
										delimiters: ['{-', '-}']
									}), $.proxy(onControllerInitialized, cont)
								);
								window.myRegistry[controllerInfo.name] = miniCartController.sync;
								return false;
							}


							if (cont.setup) {
								data = cont.setup(info.$mainEl, data) || data;
							}

							// Intercept controller update/initialization
							interceptor = controllersInterceptors[controllerInfo.name];
							if (interceptor) {
								interceptionResult = interceptor(data, template, info.$mainEl) || {};
								data = interceptionResult.data || data;
								template = interceptionResult.template || template;
								info.$mainEl = interceptionResult.$mainEl || info.$mainEl;
								cont.onInitialized = interceptionResult.onInitialized;
							}

							// TODO We still have controllers with no template bindings
							if (template) {
								if (controllerInfo.isPersistent && !isBootstrap) {
									controllerInfo.synchronizer.set(data);
									onControllerInitialized(cont);
									return false;
								} else {
									synchronizer = new R({
										controllerName: cont.name,
										el: info.$mainEl[0],
										template: template,
										data: data,
										delimiters: ['{-', '-}']/*,
										onchange: function () {
											console.log('Ractive data changed!!', controllerInfo.name);
										},
										oncomplete: function () {
											console.log('Ractive transitions completed!', controllerInfo.name);
										},
										onconfig: function () {
											console.log('Ractive configuration options processed!', controllerInfo.name);
										},
										onconstruct: function () {
											console.log('Ractive instance created!', controllerInfo.name);
										},
										ondetach: function () {
											console.log('Ractive detached!', controllerInfo.name);
										},
										oninit:  function () {
											console.log('Ractive is about to bne rendered', controllerInfo.name);
										},
										oninsert: function () {
											console.log('Ractive inserted!', controllerInfo.name);
										},
										onrender: function () {
											console.log('Ractive instance rendered!', controllerInfo.name);
										},
										onteardown: function () {
											console.log('Ractive instance destroyed!!!', controllerInfo.name);
										},
										onunrender: function () {
											console.log('Ractive instance unrendered', controllerInfo.name);
										},
										onupdate: function () {
											console.log('Ractive updated', controllerInfo.name);
										}*/
									});
									cont.sync = synchronizer;
									window.myRegistry[controllerInfo.name] = synchronizer;

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

					} catch (e) {
						console.log('Error initializing controller %s: %s', controller, e);
						console.log(e.stack);
					}
				});

				// TODO Controllers initialization timeout
			});

		}

		return {
			config: config,
			registerInterceptor: registerInterceptor,
			removeInterceptor: removeInterceptor
		};
	});
}());