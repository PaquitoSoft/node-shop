(function() {
	'use strict';

	// Product model
	define(['jquery'], function($) {
		
		function Product(data) {
			var self = this;
			$.each(data, function(key, value) {
				self[key] = data[key];
			});
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