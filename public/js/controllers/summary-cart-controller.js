(function() {
	// SummaryCartController
	define(['jquery', 'plugins/events-manager', 'plugins/templates', 'models/shop-cart'], function($, events, templates, ShopCart) {
		var $el,
			$shopCartItemsWrapper,
			shopCart,
			itemsRendered = false;

		function _renderOrderItems(done) {
			templates.render('shop-cart-items', { orderItems: shopCart.orderItems }, function (html) {
				$shopCartItemsWrapper.html(html);
				if (done) done();
			});
		}

		function _toggle() {
			if (shopCart && shopCart.orderItems.length) {
				if (!itemsRendered) {
					_renderOrderItems(function() {
						itemsRendered = true;
						$el.addClass('visible');
					})
				} else {
					$el.toggleClass('visible');
				}
			}
		}

		function _onProductAddedToCart(data) {
			
			shopCart.addProduct(data.product, data.colorId, data.sizeId);
			_renderOrderItems();
			
			console.log('SummaryCartController# Prouduct added to cart:', data.shopCartItem);
		}

		function configure($mainEl, data) {
			$el = $mainEl;
			$shopCartItemsWrapper = $mainEl.find('._list');
			shopCart = new ShopCart(data.shopCart);

			// Maybe we should render summary cart only when user wants to see it

			events.on('toggleSummaryCartRequested', _toggle);

			events.on('productAddedToCart', _onProductAddedToCart);

			console.log('SummaryCartController initialized!');
		}

		return {
			init: configure
		};

	});
}());