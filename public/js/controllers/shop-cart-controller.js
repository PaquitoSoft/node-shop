(function() {
	'use strict';

	// ShopCartController
	define(['jquery', 'stores/shop-cart'], function($, ShopCartStore) {
		var context, sync;

		function deleteOrderItem(rEvent) {
			rEvent.original.preventDefault();
			ShopCartStore.removeOrderItem(context.orderItems.indexOf(rEvent.context))
				.done(function (orderItems) {
					sync.set('ordetItems', orderItems);
					sync.set('orderTotalAmount', ShopCartStore.getTotalAmount().toFixed(2));
					
				});
		}

		function setup($mainEl, data) {
			data.orderItems = ShopCartStore.getOrderItems();
			data.orderTotalAmount = ShopCartStore.getTotalAmount().toFixed(2);
		}

		function init($mainEl, data, synchronizer) {
			context = data;
			sync = synchronizer;
			
			sync.on('deleteOrderItem', deleteOrderItem);

			console.log('ShopCartController initialized!');
		}

		return {
			setup: setup,
			init: init,
			templateName: 'shop-cart'
		};

	});
}());