(function() {
	'use strict';

	// Handlebars helpers plugin
	define(['handlebars', 'plugins/data-layer'], function(Handlebars, dataLayer) {
		
		function extendeHandlerbars() {
			
			Handlebars.registerHelper('ifMultipleIndex', function (num, options) {
				if ((num + 1) % 3 === 0) {
					return options.fn(this);
				}
			});

			Handlebars.registerHelper('size', function (arr) {
				return arr.length;
			});

			Handlebars.registerHelper('clientDataLayer', function (controllerName, key, value, options) {
				dataLayer[controllerName] = dataLayer[key] || {};
				dataLayer[controllerName][key] = value;
				return true;
			});

		}

		return {
			extendeHandlerbars: extendeHandlerbars
		};

	});
}());