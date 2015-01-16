(function() {
	'use strict';

	// Events Manager plugin
	define(['jquery'], function($) {

		var eventsMap = {};

		function on(eventName, callback) {
			var fns = eventsMap[eventName] || [];
			if (!~$.inArray(callback, fns)) {
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
					console.warn(e.message);
					console.warn(e.stack);
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