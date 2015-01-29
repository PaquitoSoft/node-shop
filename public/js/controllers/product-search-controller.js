(function() {
	'use strict';
	
	// ProductSearchController
	define(['controllers/base-controller'], function(BaseController) {
		
		var ProductSearchController = BaseController.extend({
			templateName: '',
			init: function() {
				console.log('ProductSearchController initialized!');
			}
		});

		return ProductSearchController;
	});
}());