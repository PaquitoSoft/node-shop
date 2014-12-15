(function() {
	// ProductsGridController
	define(['jquery', 'plugins/local-storage'], function($, storage) {

		function configure($mainEl) {
			console.log('ProductsGridController initialized!');

			$mainEl.on('click', '._product-summary', function(e) {
				
				storage.store('selectedCategoryProductId', $(this).attr('data-id'));

				// TODO Should read products ids from an app context repository
				var categoryProductsIds = $mainEl.find('._product-summary').map(function() {
					return $(this).attr('data-id');
				});
				storage.store('currentCategoryProductsIds', categoryProductsIds.toArray());
			});

		}

		return {
			init: configure
		};

	});
}());