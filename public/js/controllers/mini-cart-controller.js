(function() {
	// MiniCartController
	define(['jquery', 'plugins/events-manager', 'plugins/local-storage'], function($, events, storage) {
		var $itemsCount;

		// TODO Retrieve mini-cart if local info has expired

		function _initUI() {
			var miniCart = storage.retrieve('mini-cart');
			if (miniCart) {
				$itemsCount.text(miniCart.count);	
			}
		}

		function _onProductAddedToCart() {
			var miniCart = storage.retrieve('mini-cart') || { count: 0 };
			miniCart.count += 1;
			storage.store('mini-cart', miniCart, { ttl: 1500 });
			$itemsCount.text(miniCart.count);
		}

		function configure($mainEl) {
			$itemsCount = $mainEl.find('._items-count');

			_initUI();
			events.on('productAddedToCart', _onProductAddedToCart);

			console.log('MiniCartController initialized!');
		}

		return {
			init: configure
		};

	});
}());