(function() {
	'use strict';

	// Router plugin
	define(['pagejs', 'jquery', 'plugins/templates', 'plugins/controllers-manager-2', 'plugins/events-manager', 'plugins/data-layer'],
		function(page, $, templates, controllersManager, events, dataLayer) {
		
		var $mainContainer,
			lastUsedTemplate,
			externalMiddleware = {
				beforeRequest: [],
				beforeRender: [],
				beforeShow: []
			};

		function pageTransitionHandled(url, currentTemplateName, routeOptions, serverData) {
			lastUsedTemplate = currentTemplateName;

			// Update document title
			if (dataLayer.shared && dataLayer.shared.docTitle) {
				$(document).find('head title').text(dataLayer.shared.docTitle);
				dataLayer.shared.docTitle = undefined;
			}

			events.trigger('NAVIGATION_DONE', {url: url, serverData: serverData});

			if (routeOptions.foldedMenu) {
				events.trigger('FOLDED_MENU_REQUESTED');
			}

			console.log('Navigation done!');
		}

		function defaultHandler(options) {
			options = options || {};
			return function(context/*, next*/) {
				console.log('Navigating to:', context.path, context);
				events.trigger('NAVIGATION_START', {url: context.path});
				$.getJSON(context.path)
					.done(function (data) {
						events.trigger('NAVIGATION_CHANGING', {url: context.path, serverData: data});
						var isSameView = data.template === lastUsedTemplate;

						if (isSameView) {
							console.log('Router# only update data');
							controllersManager.config($mainContainer, data, {
								isBootstrap: false,
								isUpdateOnly: true
							});

							pageTransitionHandled(context.path, data.template, options, data);

						} else {
							console.log('Router# Change view');
							templates.getTemplate(data.template, function (err, html) {
								if (html) {
									var $html = $($.parseHTML(html.trim())),
										$prevContent = $mainContainer.clone(),
										$controllers = $html.data('controller') ? $html : $html.find('[data-controller]');
									
									$controllers.css('visibility', 'hidden');
									$mainContainer.empty().html($html);

									controllersManager.config($mainContainer, data, {
										isBootstrap: false,
										isUpdateOnly: false,
										done: function() {
											$controllers.css('visibility', 'visible');
											controllersManager.cleanup($prevContent, $html);
										}
									});

									pageTransitionHandled(context.path, data.template, options, data);
								} else {
									console.warn('Could not render page (no template)');
								}
							});
						}

					})
					.fail(function (xhr, textStatus, err) {
						// TODO Handle error properly
						console.error('Error handling ' + context.path + ' route:', textStatus);
					});
			};
		}



		function executeMiddleware(middlewareType, context, serverData) {
			var deferred = $.Deferred(),
				fns = externalMiddleware[middlewareType] || [],
				count = fns.length,
				to, checker;

			if (count) {
				
				checker = function() {
					if (--count <= 0) {
						clearTimeout(to);
						deferred.resolve();
					}
				};

				externalMiddleware[middlewareType].forEach(function(fn) {
					fn.call(null, context.path, serverData, checker);
				});

				to = setTimeout(function() {
					if (count > 0) {
						count = -1;
						deferred.resolve();
					}
				}, 5000);

			} else {
				deferred.resolve();
			}

			return deferred.promise();
		}


		function updateState(context, routeOptions, serverData) {
			var deferred = $.Deferred();

			console.log('Router# only update data');
			controllersManager.config($mainContainer, serverData, {
				isBootstrap: false,
				isUpdateOnly: true,
				done: $.proxy(deferred.resolve, null, context, routeOptions, serverData)
				// done: function() {
				//	executeMiddleware('beforeShow', context, serverData).then(function () {
				//		deferred.resolve(context, routeOptions, serverData);
				//	});
				// }
			});

			return deferred.promise();
		}

		function transitionView(context, routeOptions, serverData) {
			var deferred = $.Deferred();

			templates.getTemplate(serverData.template, function (err, html) {
				if (html) {
					var $html = $($.parseHTML(html.trim())),
						$prevContent = $mainContainer.clone(),
						$controllers = $html.data('controller') ? $html : $html.find('[data-controller]');
					
					$controllers.css('visibility', 'hidden');
					$mainContainer.empty().html($html);

					controllersManager.config($mainContainer, serverData, {
						isBootstrap: false,
						isUpdateOnly: false,
						done: function() {

							executeMiddleware('beforeShow', context, serverData).then(function () {
								$controllers.css('visibility', 'visible');
								deferred.resolve(context, routeOptions, serverData);
								controllersManager.cleanup($prevContent, $html);
							});
							
						}
					});

				} else {
					console.warn('Could not render page (no template)');
					deferred.reject(new Error('Could not render page (no template)'));
				}
			});

			return deferred.promise();
		}

		function loadServerData(context, routeOptions) {
			var deferred = $.Deferred();

			$.getJSON(context.path)
				.done(function (data) {
					deferred.resolve(context, routeOptions, data);
				})
				.fail(deferred.reject);

			return deferred.promise();
		}

		function transitionPage(context, routeOptions, serverData) {

			if (serverData.template === lastUsedTemplate) {
				return updateState(context, routeOptions, serverData);
			} else {
				return transitionView(context, routeOptions, serverData);
			}

		}

		function updateDocumentMetadata(context, routeOptions, serverData) {
			var deferred = $.Deferred();

			if (dataLayer.shared && dataLayer.shared.docTitle) {
				$(document).find('head title').text(dataLayer.shared.docTitle);
				dataLayer.shared.docTitle = undefined;
			}
			setTimeout(function() {
				deferred.resolve(context, routeOptions, serverData);
			}, 4);

			return deferred.promise();
		}

		function notify(context, routeOptions, serverData) {
			var deferred = $.Deferred();

			events.trigger('NAVIGATION_DONE', {url: context.path, serverData: serverData});
			setTimeout(function() {
				deferred.resolve(context, routeOptions, serverData);
			}, 4);

			return deferred.promise();
		}

		function processRouteOptions(context, routeOptions, serverData) {
			var deferred = $.Deferred();
			console.log('Change URL context:', context);
			if (routeOptions.foldedMenu) {
				events.trigger('FOLDED_MENU_REQUESTED');
			}
			setTimeout(function() {
				deferred.resolve(context, routeOptions, serverData);
			}, 4);

			return deferred.promise();
		}

		function defaultHandler2(routeOptions) {
			var _options = routeOptions || {};

			return function(context/*, next*/) {
				console.time('Nagivation');
				events.trigger('NAVIGATION_START', {url: context.path});
				loadServerData(context, _options)
					.then(transitionPage)
					.then(updateDocumentMetadata)
					.then(notify)
					.then(processRouteOptions)
					.then(function(context, routeOptions, serverData) {
						lastUsedTemplate = serverData.template;
						console.timeEnd('Navigation');
					})
					.fail(function () {
						console.log('Router# Error navigating', arguments);
					});
				// loadServerData(context, _options)
				// 	.done(function(data) {
				// 		console.log('OK');
				// 	})
				// 	.fail(function() {
				// 		console.log('KO');
				// 	});
			};
		}

		function navTo(path) {
			page(path);
		}

		function registerMiddleware(type, fn) {
			externalMiddleware[type] = externalMiddleware[type] || [];
			externalMiddleware[type].push(fn);
		}

		function init(options) {
			$mainContainer = $('#main');
			lastUsedTemplate = options.viewName;

			page('/', defaultHandler2({
				foldedMenu: true
			}));
			page('/catalog/category/:categoryId/:categoryName', defaultHandler2());
			page('/catalog/category/:categoryId/product/:productId/:productName?', defaultHandler2());
			page('/shop/cart', defaultHandler({
				foldedMenu: true
			}));

			/*
				page([options])

				Register page's popstate / click bindings. If you're doing selective binding you'll like want to pass { click: false } to specify this yourself. The following options are available:

				click bind to click events [true]
				popstate bind to popstate [true]
				dispatch perform initial dispatch [true]
				hashbang add #! before urls [false]
				decodeURLComponents remove URL encoding from path components and route params [true]

				If you wish to load serve initial content from the server you likely will want to set dispatch to false.
			*/
			page({ dispatch: false });

			console.log('Router configured!');
		}

		return {
			init: init,
			navTo: navTo,
			registerMiddleware: registerMiddleware
		};
	});
}());