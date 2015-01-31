(function() {
	'use strict';
	
	// Controller Manager plugin
	define(['jquery', 'ractive', 'plugins/data-layer', 'plugins/templates', 'plugins/decorators/image-lazy-load'], function($, R, dataLayer, templates) {

		var controllersRegistry = {};

		function _getTemplate(templateName, $controllerMainEl, controllerData, isBootstrap, done) {
			if (!templateName) { return done(''); } // TODO We still have dummy controllers
			
			if (isBootstrap) {
				// Get template from plugin
				templates.render(templateName, controllerData, function(tpl) {
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

		function checkControllersInitialization(controllersNames, initializedControllerName, allDone) {
			var index = $.inArray(initializedControllerName, controllersNames);
			if (index !== -1) {
				controllersNames.splice(index, 1);
				if (!controllersNames.length) {
					allDone();
				}
			}
		}

		function checkControllersInitialization2(controllersInfo, initializedController, allDone) {
			var index = controllersInfo.indexOf(initializedController),
				finish;

			if (index !== -1) {
				controllersInfo[index].__initialized = true;

				finish = controllersInfo.every(function(ci) {
					return ci.__initialized;
				});

				if (finish) {
					allDone();
					cleanup2(controllersInfo);
				}
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

			// Let's also add persistent controllers which have not been received in the new content
			Object.keys(controllersRegistry).forEach(function(key) {
				var dependency = 'controllers/' + key,
					controller = controllersRegistry[key];

				if (controller.isPersistent && !~dependencies.indexOf(dependency)) {
					controllersInfo.push({
						name: key,
						$mainEl: controller.$mainEl,
						isPersistent: true
					});
					dependencies.push(dependency);
				}
			});

			// Require all controllers at once
			require(dependencies, function() {
				var currentControllersNames = $.map(controllersInfo, function(ci) {
					return ci.name;
				});
				
				// TODO Checking process in case a controller initialization timesout or takes too long

				$.each(arguments, function(index, Controller) {
					var controllerInfo = controllersInfo[index],
						controllerData = dataLayer[controllerInfo.name] || {},
						oldInstance = controllersRegistry[controllerInfo.name],
						newInstance;

					if (oldInstance && oldInstance.isPersistent) {

						oldInstance.update(controllerData);
						checkControllersInitialization(currentControllersNames, controllerInfo.name, done);
						// checkControllersInitialization2(controllersInfo, controllerInfo, done);

					} else {
						
						// Create controller
						newInstance = new Controller(controllerInfo.$mainEl, controllerData, controllerInfo.isPersistent);


						_getTemplate(newInstance.templateName, controllerInfo.$mainEl, controllerData, isBootstrap, function(tpl) {
							
							newInstance.start(tpl, controllerInfo.name, function () {
									if (oldInstance) { oldInstance.reset(); }

									controllersRegistry[controllerInfo.name] = newInstance;

									checkControllersInitialization(currentControllersNames, controllerInfo.name, done);
									// checkControllersInitialization2(controllersInfo, controllerInfo, done);
								}
							);

						});

					}

				});
			});

		}

		function _getControllersNames($el) {
			return $el.find('[data-controller]').andSelf().filter('[data-controller]').map(function (index, el) {
				return $(el).attr('data-controller');
			}).get();
		}

		/*
			Teardown controllers that are no needed in the new presentation state
		*/
		function cleanup($oldContent, $newContent) {
			console.time('ControllersManager::cleanup');
			var prevControllers = _getControllersNames($oldContent);
			var newControllers = _getControllersNames($newContent);

			prevControllers.forEach(function (prevControllerName) {
				var controller;
				if (!~newControllers.indexOf(prevControllerName)) {
					controller = controllersRegistry[prevControllerName];
					if (controller && !controller.isPersistent) {
						controller.reset();
						delete controllersRegistry[prevControllerName];
					}
				}
			});
			console.timeEnd('ControllersManager::cleanup');
		}

		function cleanup2(newControllersInfo) {
			console.time('cleanup2');
			var deprecatedControllers;
			Object.keys(controllersRegistry).forEach(function(controllerName) {
				if (!controllersRegistry[controllerName].isPersistent) {
					deprecatedControllers = newControllersInfo.filter(function(ci) {
						return ci.name === controllerName;
					});
					if (!deprecatedControllers.length) {
						console.log('Destroying deprecated controller:', controllerName);
						controllersRegistry[controllerName].reset();
						delete controllersRegistry[controllerName];
					}
				}
			});
			console.timeEnd('cleanup2');
		}

		return {
			config: config,
			cleanup: cleanup/*,
			registerInterceptor: registerInterceptor,
			removeInterceptor: removeInterceptor*/
		};
	});
}());