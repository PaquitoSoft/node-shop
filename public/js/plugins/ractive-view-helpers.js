(function() {
	'use strict';

	// Ractive client side helpers plugin
	define(['ractive', 'plugins/data-layer'], function(R, dataLayer) {

		var helpers = R.defaults.data;

		helpers.clientDataLayer = function _clientDataLayer(key, attr, value) {
			// console.log('Client Data Layer Helper!!!');
			
			dataLayer[key] = dataLayer[key] || {};
			dataLayer[key][attr] = value;

			// console.log(this.data);

			return '';
		};

	});
}());