(function() {
	'use strict';

	// Handlebars helpers plugin
	define(['handlebars'], function(Handlebars) {
		
		function _apply() {
			
			Handlebars.registerHelper('ifMultipleIndex', function (num, options) {
				if ((num + 1) % 3 === 0) {
					return options.fn(this);
				}
			});

			Handlebars.registerHelper('size', function (arr) {
				return arr.length;
			})

		}

		return {
			extendeHandlerbars: _apply
		}

	});
}());