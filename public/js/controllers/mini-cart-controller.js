(function() {
	'use strict';

	// MiniCartController
	define(['jquery', 'plugins/events-manager', 'stores/shop-cart'], function($, events, ShopCartStore) {
		var sync;

		function _onShopCartUpdated() {
			try {
				sync.set('shoppingCart.unitsCount', ShopCartStore.getUnitsCount());
			} catch (err) {
				console.log('ERRORRRRRR:', err.message);
			}
		}

		function setup($mainEl, data) {
			data.shoppingCart = {
				unitsCount: ShopCartStore.getUnitsCount()
			};
			return data;
		}

		function init($mainEl, data, synchronizer) {
			sync = synchronizer;
			
			events.on('productAddedToCart', _onShopCartUpdated);
			events.on('productRemovedFromCart', _onShopCartUpdated);

			sync.on('showSummaryCart', function(e) {
				e.original.preventDefault();
				events.trigger('toggleSummaryCartRequested');
			});

			console.log('MiniCartController initialized!');
		}

		return {
			setup: setup,
			init: init,
			templateName: 'partials/mini-cart'
		};

	});
}());