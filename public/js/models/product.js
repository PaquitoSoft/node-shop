(function() {
	'use strict';

	// Product model
	define(['jquery', 'plugins/events-manager', 'plugins/app-context'], function($, events, appContext) {
		
		function Product(data) {
			Object.keys(data).forEach(function(key) {
				this[key] = data[key];
			}, this);
		}

		Product.prototype.getColor = function(colorId) {
			var result,
				i = this.colors.length;

			while (i--) {
				if (this.colors[i].id == colorId) {
					result = this.colors[i];
					break;
				}
			}

			return result;
		};

		return Product;
	});
}());