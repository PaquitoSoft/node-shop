(function() {
	'use strict';

	// BaseController
	define(['jquery'], function($) {

		function onControllerInitialized(controller, done) {
			controller.fire('postInit');
			if (done) {
				done.call(controller, controller);
			}
		}
		
		var BaseController = function($mainEl, data, isPersistent) {
			this.$mainEl = $mainEl;
			this.data = data;
			this.isPersistent = !!isPersistent;
			this.events = {};
		};

		BaseController.extend = function _extend(methods) {
			var i,
				Klass = function Klass() {
					BaseController.apply(this, arguments);
				};

			Klass.prototype = BaseController.prototype;
			Klass.prototype.constructor = Klass;

			$.each(methods || {}, function(key, value) {
				if (/^on.*/.test(key) && key.length > 2) {
					key = key[2].toLowerCase() + key.substr(3);
					Klass.prototype.listeners[key] = value;
				} else {
					Klass.prototype[key] = value;
				}
			});

			return Klass;
		};

		BaseController.prototype.setup = function() {};
		BaseController.prototype.init = function() {};
		BaseController.prototype.listeners = {};

		BaseController.prototype.fire = function _fire(eventName, data) {
			if (this.events[eventName]) {
				this.events[eventName](data);
			}
		};

		BaseController.prototype.on = function _on(eventName, handler) {
			this.events[eventName] = handler;
		};

		BaseController.prototype.start = function _start(synchronizer, done) {
			console.log('Initializing base controller...');
			var self = this,
				_listeners = {};
			this.sync = synchronizer;
			this.fire('preInit', {el: this.$mainEl, data: this.data});

			if (this.listeners) {
				// Ractive sets listener scope to itself
				$.map(this.listeners, function (value, key) {
					_listeners[key] = $.proxy(value, self);
				});
				this.sync.on(_listeners);
			}

			if (this.init.length > 1) {
				this.init(synchronizer, $.proxy(onControllerInitialized, this, done));
			} else {
				this.init(synchronizer);
				onControllerInitialized(this, done);
			}
		};

		BaseController.prototype.updateTemplate = function _update(template) {
			console.warn('This function is not yet implemented. Why do you need it?');
		};

		return BaseController;
	});
}());