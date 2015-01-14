(function() {
	'use strict';

	// SummaryCartController
	define(['jquery', 'plugins/events-manager', 'stores/shop-cart'], function($, events, ShopCartStore) {
		
		var $el, context, sync;

		function _toggle() {
			if (ShopCartStore.getUnitsCount()) {
				// TODO I need to learn how to maniulate main element from ractive
				// (it seems to affect only to its contents -template-)
				$el.toggleClass('visible');
			}
		}

		function _onProductAddedToCart(data) {
			sync.set('orderItems', data.orderItems);
		}

		function deleteOrderItem(rEvent) {
			rEvent.original.preventDefault();
			ShopCartStore.removeOrderItem(context.orderItems.indexOf(rEvent.context))
				.done(function (orderItems) {
					sync.set('ordetItems', orderItems);
				});
		}

		function setup($mainEl, data) {
			data.orderItems = ShopCartStore.getOrderItems();
			return data;
		}

		function init($mainEl, data, synchronizer) {
			$el = $mainEl;
			context = data;
			sync = synchronizer;
			
			events.on('toggleSummaryCartRequested', _toggle);
			events.on('productAddedToCart', _onProductAddedToCart);

			sync.on('deleteOrderItem', deleteOrderItem);

			console.log('SummaryCartController initialized!');
		}

		return {
			setup: setup,
			init: init,
			templateName: 'partials/mini-shop-cart-items'
		};

	});
}());