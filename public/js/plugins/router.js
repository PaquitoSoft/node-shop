(function() {
	'use strict';

	// Router plugin
	define(['pagejs', 'jquery', 'plugins/templates', 'plugins/controllers-manager-2', 'plugins/events-manager', 'plugins/data-layer'],
		function(page, $, templates, controllersManager, events, dataLayer) {
		
		var $mainContainer,
			lastUsedTemplate;

		function pageTransitionHandled(url, currentTemplateName, routeOptions) {
			lastUsedTemplate = currentTemplateName;

			// Update document title
			if (dataLayer.shared && dataLayer.shared.docTitle) {
				$(document).find('head title').text(dataLayer.shared.docTitle);
				dataLayer.shared.docTitle = undefined;
			}

			events.trigger('NAVIGATION_DONE', {url: url});

			if (routeOptions.foldedMenu) {
				events.trigger('FOLDED_MENU_REQUESTED');
			}

			console.log('Navigation done!');
		}

		function defaultHandler(options) {
			options = options || {};
			return function(context/*, next*/) {
				console.log('Navigating to:', context.path);
				$.getJSON(context.path)
					.done(function (data) {

						var isSameView = data.template === lastUsedTemplate;

						if (isSameView) {
							
							controllersManager.config($mainContainer, data, {
								isBootstrap: false,
								isUpdateOnly: true
							});

							pageTransitionHandled(context.path, data.template, options);

						} else {
							templates.render(data.template, data, function (html) {
								if (html) {
									var $html = $($.parseHTML(html)),
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

									pageTransitionHandled(context.path, data.template, options);
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

		function navTo(path) {
			page(path);
		}

		function init() {
			$mainContainer = $('#main');

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

			console.log('Router configured!');
		}

		return {
			init: init,
			navTo: navTo
		};
	});
}());