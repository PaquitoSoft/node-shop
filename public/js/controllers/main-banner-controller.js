(function() {
	'use strict';

	// MainBannerController (persistent)
	define(function() {
		
		function init($mainEl, data, synchronizer) {
			console.log('MainBannerController initialized!');
			synchronizer.set('mainBanner', data.mainBanner);
		}

		return {
			init: init,
			templateName: 'partials/main-banner'
		};

	});
}());