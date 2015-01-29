(function() {
	'use strict';

	// MainBannerController (persistent)
	define(['controllers/base-controller'], function(BaseController) {
		
		var MiniBannerController = BaseController.extend({

			templateName: 'partials/main-banner',
			
			init: function() {
				console.log('MainBannerController initialized!');
			}
		});

		return MiniBannerController;
	});
}());