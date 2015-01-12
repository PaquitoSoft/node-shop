(function() {
	'use strict';

	// ProductsGridController
	define(['jquery', 'plugins/local-storage'], function($, storage) {

		function init($mainEl, data, sync) {

			sync.on('productSelection', function(rEvent) {
				storage.store('selectedCategoryProductId', rEvent.context._id);

				var categoryProductsIds = data.products.map(function(product) {
					return product._id;
				});

				storage.store('currentCategoryProductsIds', categoryProductsIds);
			});

			console.log('ProductsGridController initialized!');
		}

		return {
			init: init,
			templateName: 'partials/products-grid'
		};

	});
}());