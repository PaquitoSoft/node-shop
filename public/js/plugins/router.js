(function() {
	'use strict';

	// Router plugin
	define(['pagejs', 'jquery', 'plugins/templates', 'plugins/controllers-manager', 'plugins/events-manager'],
		function(page, $, templates, controllersManager, events) {
		
		var $mainContainer;

		function handler(options) {
			return function(context/*, next*/) {
				// console.log(context);
				// options.handler.call(null, context, options.template);
				console.log('Navigating to:', context.path);
				$.getJSON(context.path)
					.done(function (data) {
						templates.render(options.template, data, function (html) {
							if (html) {
								$mainContainer.empty().html(html);
								controllersManager.config($mainContainer);
								events.trigger('NAVIGATION_DONE', {url: context.path});

								if (options.foldedMenu) {
									events.trigger('FOLD_MENU_REQUEST');
								}

								console.log('Navigation done!');
							} else {
								console.warn('Could not render HOME page (no template)');
							}
						});
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

			page('/', handler({
				template: 'home',
				foldedMenu: true
			}));
			page('/catalog/category/:categoryId/:categoryName', handler({
				template: 'category'
			}));
			page('/catalog/category/:categoryId/product/:productId/:productName?', handler({
				template: 'product-detail'
			}));
			page('/shop/cart', handler({
				template: 'shop-cart',
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