(function() {
	'use strict';

	// BaseController
	define(['jquery', 'ractive'], function($, R) {

		function onControllerInitialized(controller, done) {
			controller.fire('postInit');
			if (done) {
				done.call(controller, controller);
			}
		}
		
		var BaseController = function(name, $mainEl, serverResponse, isPersistent) {
			if (name) {
				this.name = name;
				this.$mainEl = $mainEl;
				this.isPersistent = !!isPersistent;
				this.data = {};
				this.events = {};

				if (this.props && this.props.length) {
					this.props.forEach(function(key) {
						this.data[key] = serverResponse[key];
					}, this);
				}
			}
		};

		BaseController.extend = function _extend(methods) {
			var i,
				Klass = function Klass() {
					BaseController.apply(this, arguments);
				};

			Klass.prototype = new BaseController();
			Klass.prototype.constructor = Klass;
			Klass.prototype.setup = function() {};
			Klass.prototype.init = function() {};
			Klass.prototype.domListeners = {};
			Klass.prototype.innerListeners = {};

			$.each(methods || {}, function(key, value) {
				if (/^on.*/.test(key) && key.length > 2) {
					key = key[2].toLowerCase() + key.substr(3);
					Klass.prototype.domListeners[key] = value;
				} else if (/^_on.*/.test(key)) {
					key = key[3].toLowerCase() + key.substr(4);
					Klass.prototype.innerListeners[key] = value;
				} else {
					Klass.prototype[key] = value;
				}
			});

			return Klass;
		};
		
		BaseController.prototype.fire = function _fire(eventName, data) {
			if (this.events[eventName]) {
				this.events[eventName].call(this, data);
			}
		};

		BaseController.prototype.on = function _on(eventName, handler) {
			this.events[eventName] = handler;
		};

		BaseController.prototype.start = function _start(/*template,*/ done) {
			var self = this,
				_domListeners = {};

			// this.template = template;

			this.setup();

			this.sync = new R({
				name: this.controllerName,
				el: this.$mainEl[0],
				template: this.template,
				data: this.data,
				components: this.components || {}
			});

			this.fire('preInit', {el: this.$mainEl, data: this.data});

			// Set up ractive (DOM) listeners
			$.map(this.domListeners, function (value, key) {
				// Ractive sets listener scope to itself so we have to change it
				self.sync.on(key, $.proxy(value, self));
			});
			// TODO Should I remove domListeners from the prototype???

			// Setup controller inner listeners
			$.map(this.innerListeners, function (value, key) {
				self.on(key, value);
			});

			if (this.init.length > 1) {
				this.init(this.sync, $.proxy(onControllerInitialized, this, done));
			} else {
				this.init(this.sync);
				onControllerInitialized(this, done);
			}
		};

		BaseController.prototype.update = function _update(data) {
			this.fire('preUpdate', {data: data});
			if (this.props && this.props.length) {
				this.props.forEach(function(key) {
					this.data[key] = data[key];
				}, this);
			}
			this.sync.set(data);
			this.fire('postUpdate');
		};

		BaseController.prototype.reset = function _reset() {
			this.sync.teardown();
		};

		BaseController.prototype.addDomListener = function(eventName, listener) {
			var sync = this.sync,
				prev = sync._subs[eventName],
				self;

			if (prev && prev.length) {
				self = $.extend(true, {}, this);
				self._super = prev[0];
				sync.off(eventName, prev[0]);
				sync.on(eventName, function() {
					listener.apply(self, Array.prototype.slice.call(arguments));
				});
			} else {
				sync.on(eventName, $.proxy(listener, this));
			}
		};

		// TODO Maybe it's better to have an extendDomListener to show intent of altering
		// the function (so there can be several listeners for the same event???)

		BaseController.prototype.updateTemplate = function _updateTemplate(template) {
			console.warn('This function is not yet implemented. Why do you need it?');
		};

		return BaseController;
	});
}());