'use strict';

// DUST client side helpers plugin

var /*dust = require('dustjs'),
	dustHelpers = require('dustjs-linkedin'),*/
	dust = require('dustjs-helpers'),
	dataLayer = require('./data-layer');

function registerDustHelpers() {
	
	dust.helpers.clientDataLayer = function clientDataLayer(chunk, context, bodies, params) {
		var key = dust.helpers.tap(params.key, chunk, context),
			attr = dust.helpers.tap(params.attr, chunk, context),
			data = dust.helpers.tap(params.data, chunk, context),
			ctx = context.get('clientDataLayer') || {};

		dataLayer[key] = dataLayer[key] || {};
		dataLayer[key][attr] = data;

		return chunk;
	};


}

module.exports = {
	registerDustHelpers: registerDustHelpers
};
