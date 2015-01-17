(function() {
	'use strict';

	// DocumentHeaderController (persistent)
	define(['jquery'], function($) {
		
		function init($mainEl, data, synchronizer) {
			console.log('DocumentHeaderController initialized!');
		}

		return {
			init: init,
			templateName: 'partials/document-title'
		};

	});
}());