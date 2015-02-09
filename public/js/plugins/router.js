(function() {
	'use strict';

	// Router plugin
	define(['pagejs', 'jquery', 'plugins/templates', 'plugins/controllers-manager-2', 'plugins/events-manager', 'plugins/data-layer', 'plugins/async'],
		function(page, $, templates, controllersManager, events, dataLayer, async) {
		
		var $mainContainer,
			lastUsedTemplate,
			externalMiddleware = {
				beforeRequest: [],
				beforeRender: [],
				beforeShow: []
			};

				
		function updateState(context, routeOptions, serverData) {
			var deferred = $.Deferred();

			console.log('Router# only update data');
			controllersManager.config($mainContainer, context.path, serverData, {
				isBootstrap: false,
				isUpdateOnly: true,
				done: $.proxy(deferred.resolve, null, context, routeOptions, serverData)
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
					
					async.pParallel(externalMiddleware.beforeRender, [context.path, serverData, $html], 150)
						.then( function() {
							
							$controllers.css('visibility', 'hidden');
							$mainContainer.empty().html($html);

							controllersManager.config($mainContainer, context.path, serverData, {
								isBootstrap: false,
								isUpdateOnly: false,
								done: function() {

									// async.parallel(externalMiddleware.beforeShow, [context.path, serverData], 500, function() {
									//	$controllers.css('visibility', 'visible');
									//	deferred.resolve(context, routeOptions, serverData);
									//	controllersManager.cleanup($prevContent, $html);
									// });

									async.pParallel(externalMiddleware.beforeShow, [context.path, serverData], 1500)
										.then( function() {
											$controllers.css('visibility', 'visible');
											deferred.resolve(context, routeOptions, serverData);
											controllersManager.cleanup($prevContent, $html);
										});
								}
							});

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
			console.time('Navigation::loadServerData');
			$.getJSON(context.path)
				.done(function (data) {
					console.timeEnd('Navigation::loadServerData');
					events.trigger('NAVIGATION_CHANGING', {url: context.path, serverData: data});
					// window["optimizely"].push["activate"];
					window.optimizely = window.optimizely || [];
					window.optimizely.push(["activate"]);
					// window.optimizely.activate();
					deferred.resolve(context, routeOptions, data);
				})
				.fail(deferred.reject);

			return deferred.promise();
		}

		function transitionPage(context, routeOptions, serverData) {

			// if (serverData.template === lastUsedTemplate) {
			//	return updateState(context, routeOptions, serverData);
			// } else {
			//	return transitionView(context, routeOptions, serverData);
			// }

			return transitionView(context, routeOptions, serverData);
		}

		function updateDocumentMetadata(context, routeOptions, serverData) {
			var deferred = $.Deferred();

			if (dataLayer.shared && dataLayer.shared.docTitle) {
				$(document).find('head title').text(dataLayer.shared.docTitle);
				dataLayer.shared.docTitle = undefined;
			}
			
			deferred.resolve(context, routeOptions, serverData);

			return deferred.promise();
		}

		function notify(context, routeOptions, serverData) {
			var deferred = $.Deferred();

			events.trigger('NAVIGATION_DONE', {url: context.path, serverData: serverData});

			deferred.resolve(context, routeOptions, serverData);

			return deferred.promise();
		}

		function processRouteOptions(context, routeOptions, serverData) {
			var deferred = $.Deferred();
			// console.log('Change URL context:', context);
			if (routeOptions.foldedMenu) {
				events.trigger('FOLDED_MENU_REQUESTED');
			}
			
			deferred.resolve(context, routeOptions, serverData);

			return deferred.promise();
		}

		
		function defaultHandler(routeOptions) {
			var _options = routeOptions || {};

			return function(context/*, next*/) {
				console.time('Navigation');
				events.trigger('NAVIGATION_START', {url: context.path});
				loadServerData(context, _options)
					.then(transitionPage)
					.then(updateDocumentMetadata)
					.then(notify)
					.then(processRouteOptions)
					.then(function(context, routeOptions, serverData) {
						lastUsedTemplate = serverData.template;
						console.timeEnd('Navigation');
						console.log('Navigation ended!');
					})
					.fail(function () {
						console.log('Router# Error navigating', arguments);
					});
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
			var path = window.location.pathname;
			$mainContainer = $('#main');
			lastUsedTemplate = options.viewName;

			page('/', defaultHandler({
				foldedMenu: true
			}));
			page('/catalog/category/:categoryId/:categoryName', defaultHandler());
			page('/catalog/category/:categoryId/product/:productId/:productName?', defaultHandler());
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

			// We need to publish navigation events for the experiments to fire
			// (also for analytics?)
			// events.trigger('NAVIGATION_START', {url: path});
			// events.trigger('NAVIGATION_CHANGING', {url: path, serverData: options.serverData});
			// events.trigger('NAVIGATION_DONE', {url: path, serverData: options.serverData});

			console.log('Router configured!');
		}

		return {
			init: init,
			navTo: navTo,
			registerMiddleware: registerMiddleware
		};
	});
}());