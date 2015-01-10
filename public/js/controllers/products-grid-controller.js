(function() {
	'use strict';

	// ProductsGridController
	define(['jquery', 'ractive', 'plugins/local-storage', 'plugins/templates'], function($, R, storage, templates) {

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