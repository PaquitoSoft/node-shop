(function() {
	'use strict';

	// ShopCartController
	define(['jquery', 'stores/shop-cart'], function($, ShopCartStore) {
		var $orderTotalAmount;

		function _deleteOrderItem(event) {
			event.preventDefault();
			var $orderItem = $(event.target).parents('.row'),
				orderItemIndex = $orderItem.attr('data-index');

			ShopCartStore.removeOrderItem(orderItemIndex).then(function() {
				$orderItem.remove();
				$orderTotalAmount.text(ShopCartStore.getTotalAmount().toFixed(2));
			});
		}

		function configure($mainEl) {
			$orderTotalAmount = $mainEl.find('._orderAmount');
			
			$mainEl.on('click', '._removeOrderItemLink', _deleteOrderItem);
			
			console.log('ShopCartController initialized!');
		}

		return {
			init: configure
		};

	});
}());