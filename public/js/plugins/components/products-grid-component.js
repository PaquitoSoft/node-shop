(function() {
	'use strict';

	// Data layer plugin
	define(['ractive', 'text!templates/partials/products-grid.dust', 'plugins/local-storage'], function(R, productsGridTemplate, storage) {

		var ProductsGridComponent = R.extend({
			isolated: true,
			template: productsGridTemplate,

			oninit: function () {
				this.on('productSelection', function(rEvent) {
					storage.store('selectedCategoryProductId', rEvent.context._id);

					var categoryProductsIds = this.data.products.map(function(product) {
						return product._id;
					});

					storage.store('currentCategoryProductsIds', categoryProductsIds);
				});
			}
		});

		return ProductsGridComponent;
	});
}());