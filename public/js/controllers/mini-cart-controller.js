'use strict';

// MiniCartController

var $ = require('jquery'),
	storage = require('../plugins/local-storage'),
	events = require('../plugins/events-manager'),
	ShopCartStore = require('../stores/shop-cart');

var $itemsCount;

function _initUI() {
	var miniCart = storage.retrieve('mini-cart');
	if (miniCart) {
		$itemsCount.text(miniCart.count);	
	}
}

function _onShopCartUpdated() {
	$itemsCount.text(ShopCartStore.unitsCount);
}

function configure($mainEl) {
	$itemsCount = $mainEl.find('._items-count');

	events.on('productAddedToCart', _onShopCartUpdated);
	events.on('productRemovedFromCart', _onShopCartUpdated);

	$mainEl.on('click', '.cart', function(e) {
		e.preventDefault();
		events.trigger('toggleSummaryCartRequested');
	});

	console.log('MiniCartController initialized!');
}

module.exports = {
	init: configure
};
