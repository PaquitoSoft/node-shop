(function() {
	'use strict';

	// Router plugin
	define(['pagejs', 'jquery', 'plugins/templates'], function(page, $, templates) {
		var $mainContainer;

		function navTo(options) {
			return function(context/*, next*/) {
				// console.log(context);
				// options.handler.call(null, context, options.template);
				console.log('Navigating to:', context.path);
				$.getJSON(context.path)
					.done(function (data) {
						templates.render(options.template, data, function (html) {
							if (html) {
								$mainContainer.html(html);
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
			}
		}

		function init() {
			$mainContainer = $('#main');

			page('/', navTo({
				template: 'home'
			}));
			page('/catalog/category/:categoryId/:categoryName', navTo({
				template: 'category'
			}));
			page('/catalog/category/:categoryId/product/:productId/:productName?', navTo({
				template: 'product-detail'
			}));
			page('/shop/cart', navTo({ 
				template: 'shop-cart'
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
			init: init
		};
	});
}());