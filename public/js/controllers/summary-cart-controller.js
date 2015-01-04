(function() {
	'use strict';

	// SummaryCartController
	define(['jquery', 'plugins/events-manager', 'plugins/templates', 'stores/shop-cart'], function($, events, templates, ShopCartStore) {
		var $el,
			$shopCartItemsWrapper,
			itemsRendered = false;

		function _renderOrderItems(done) {
			console.log('Rendering shop cart summary:', ShopCartStore.getOrderItems());
			templates.render('partials/mini-shop-cart-items', { orderItems: ShopCartStore.getOrderItems() }, function (html) {
				$shopCartItemsWrapper.html(html);
				if (done) done();
			});
		}

		function _deleteOrderItem(event) {
			var $link = $(event.target),
				orderItemIndex = $link.parents('.row').attr('data-index');

			event.preventDefault();
			
			ShopCartStore.removeOrderItem(orderItemIndex).done(_renderOrderItems);
		}

		function _toggle() {
			if (ShopCartStore.itemsCount) {
				if (!itemsRendered) {
					_renderOrderItems(function() {
						itemsRendered = true;
						$el.addClass('visible');
					});
				} else {
					$el.toggleClass('visible');
				}
			}
		}

		function _onProductAddedToCart(data) {
			_renderOrderItems();
		}

		function configure($mainEl, data) {
			$el = $mainEl;
			$shopCartItemsWrapper = $mainEl.find('._list');
			
			$el.on('click', '.removeLine', _deleteOrderItem);
			
			events.on('toggleSummaryCartRequested', _toggle);

			events.on('productAddedToCart', _onProductAddedToCart);

			console.log('SummaryCartController initialized!');
		}

		return {
			init: configure
		};

	});
}());