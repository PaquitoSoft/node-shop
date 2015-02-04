(function() {
	'use strict';
	
	// ProductCategoryController
	define(['controllers/base-controller', 'plugins/components/products-grid-component'], function(BaseController, ProductsGridComponent) {
		
		var ProductCategoryController = BaseController.extend({
			
			templateName: 'category',

			components: {
				'products-grid': ProductsGridComponent
			},

			props: ['catName', 'products'],

			init: function() {
				console.log('ProductCategoryController initialized!');
			}
		});

		return ProductCategoryController;
	});
}());