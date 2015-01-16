(function() {
	'use strict';

	// DUST client side helpers plugin
	define(['dust', 'dustHelpers', 'plugins/data-layer'], function(dust, helpers, dataLayer) {
		var tap = dust.helpers.tap;

		function registerDustHelpers() {
			
			dust.helpers.clientDataLayer = function clientDataLayer(chunk, context, bodies, params) {
				var key = tap(params.key, chunk, context),
					attr = tap(params.attr, chunk, context),
					data = tap(params.data, chunk, context),
					ctx = context.get('clientDataLayer') || {};

				dataLayer[key] = dataLayer[key] || {};
				dataLayer[key][attr] = data;

				return chunk;
			};

			dust.helpers.set = function _set(chunk, context, bodies, params) {
				var shared = dataLayer || {};
				shared[tap(params.param, chunk, context)] = tap(params.value, chunk, context);
				dataLayer.shared = shared;
			};

		}

		return {
			registerDustHelpers: registerDustHelpers
		};

	});
}());