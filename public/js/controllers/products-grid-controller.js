(function() {
	'use strict';

	// ProductsGridController
	define(['plugins/local-storage', 'controllers/base-controller'], function(storage, BaseController) {

		var ProductsGridController = BaseController.extend({

			templateName: 'partials/products-grid',

			props: ['products'],

			init: function() {
				console.log('ProductsGridController initialized!');
			},

			onProductSelection: function (rEvent) {
				storage.store('selectedCategoryProductId', rEvent.context._id);

				var categoryProductsIds = this.data.products.map(function(product) {
					return product._id;
				});

				storage.store('currentCategoryProductsIds', categoryProductsIds);
			}
		});

		return ProductsGridController;
	});
}());