(function() {
	'use strict';

	// Browser storage plugin
	define(function() {

		// TODO Implement ttls for any kind of values on store and retrieve

		function store(key, value, options) {
			var storage, 
				rawValue = value;

			options = options || {};
			storage = (options.ttl === 'session') ? window.sessionStorage : window.localStorage;
			
			if (typeof value !== 'string') {
				if (options.ttl && options.ttl !== 'session') {
					value._ttl = options.ttl;
				}
				rawValue = '@' + JSON.stringify(value);
			}

			storage.setItem(key, rawValue);
		}

		function retrieve(key) {
			var rawValue = window.localStorage.getItem(key) || window.sessionStorage.getItem(key),
				result = rawValue;

			if (!result) return result;

			if (rawValue[0] === '@') {
				result = JSON.parse(rawValue.substr(1));
				delete result._ttl;
			}

			return result;
		}

		return {
			store: store,
			retrieve: retrieve
		}

	});
}());