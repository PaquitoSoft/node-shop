(function() {
	'use strict';
	
	// HomeController
	define(['controllers/base-controller', 'plugins/components/products-grid-component'], function(BaseController, ProductsGridComponent) {
		
		var HomeController = BaseController.extend({
			
			templateName: 'home',

			components: {
				'products-grid': ProductsGridComponent
			},

			props: ['products'],

			init: function() {
				console.log('HomeController initialized!');
			}
		});

		return HomeController;
	});
}());