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
		
		var BaseController = function(controllerName, $mainEl, serverResponse, isPersistent) {
			if (controllerName) {
				this.controllerName = controllerName;
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

		BaseController.prototype.start = function _start(template, done) {
			var self = this,
				_domListeners = {};

			this.template = template;

			this.setup();

			this.sync = new R({
				controllerName: this.controllerName,
				el: this.$mainEl[0],
				template: template,
				data: this.data,
				components: this.components || {}
			});

			this.fire('preInit', {el: this.$mainEl, data: this.data});

			// Set up ractive (DOM) listeners
			$.map(this.domListeners, function (value, key) {
				// Ractive sets listener scope to itself so we have to change it
				_domListeners[key] = $.proxy(value, self);
			});
			this.sync.on(_domListeners);
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
			// this.data = data;
			this.fire('preUpdate', {data: data});
			if (this.props && this.props.length) {
				this.props.forEach(function(key) {
					this.data[key] = data[key];
				}, this);
			}
			this.sync.set(data);
			this.fire('postUpdate');
			// TODO Attach Ractive to the new element
			// this.sync.insert($el[0]);
		};

		BaseController.prototype.reset = function _reset() {
			this.sync.teardown();
		};

		BaseController.prototype.updateTemplate = function _updateTemplate(template) {
			console.warn('This function is not yet implemented. Why do you need it?');
		};

		return BaseController;
	});
}());