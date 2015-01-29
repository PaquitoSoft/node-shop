(function() {
	'use strict';

	// Events Manager plugin
	define(function() {

		var eventsMap = {};

		function on(eventName, callback, context) {
			var fns = eventsMap[eventName] || [];
			if (fns.indexOf(callback) === -1) {
				fns.push({
					listener: callback,
					scope: context
				});
				eventsMap[eventName] = fns;
			}
		}

		function trigger(eventName, data) {
			var fns = eventsMap[eventName] || [],
				i = 0, len = fns.length;

			for (; i < len; i++) {
				try {
					fns[i].listener.call(fns[i].scope, data);
				} catch (e) {
					console.warn('Error executing event callback:', eventName);
					console.warn(e.stack);
				}
			}
		}
		
		return {
			on: on,
			// TODO once: once,
			trigger: trigger
		};

	});
}());