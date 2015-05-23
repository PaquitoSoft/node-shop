'use strict';

var $ = require('jquery'),
	ShopCartStore = require('../stores/shop-cart');

var $orderTotalAmount;

function _deleteOrderItem(event) {
	event.preventDefault();
	var $orderItem = $(this).parents('.row'),
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

module.exports = {
	init: configure
};
