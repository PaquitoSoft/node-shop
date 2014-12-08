(function() {
	// MiniCartController
	define(['jquery', 'plugins/events-manager'], function($, events) {

		
		function configure($mainEl) {
			var $itemsCount = $mainEl.find('._items-count');
			console.log('MiniCartController initialized!');

			events.on('productAddedToCart', function() {
				console.log('MiniCartController: Updating minicart');
				$itemsCount.text(parseInt($itemsCount.text(), 10) + 1);
				console.log('MiniCartController: Minicart updated!');
			});
		}

		return {
			init: configure
		};

	});
}());