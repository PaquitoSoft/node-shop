(function() {
	'use strict';

	// Events Manager plugin
	define(function() {

		var eventsMap = {};

		function on(eventName, callback) {
			var fns = eventsMap[eventName] || [];
			if (fns.indexOf(callback) === -1) {
				fns.push(callback);
				eventsMap[eventName] = fns;
			}
		}

		function trigger(eventName, data) {
			var fns = eventsMap[eventName] || [],
				i = 0, len = fns.length;

			for (; i < len; i++) {
				try {
					fns[i](data);
				} catch (e) {
					console.warn('Error executing event callback:', eventName);
					console.warn(e);
				}
			}
		}
		
		return {
			on: on,
			// TODO once: once,
			trigger: trigger
		}

	});
}());