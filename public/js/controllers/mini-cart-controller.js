(function() {
	'use strict';

	// MiniCartController
	define(['jquery', 'plugins/events-manager', 'stores/shop-cart', 'controllers/base-controller'], function($, events, ShopCartStore, BaseController) {
		var sync;

		function _onShopCartUpdated() {
			sync.set('shoppingCart.unitsCount', ShopCartStore.getUnitsCount());
		}

		function setup($mainEl, data) {
			data.shoppingCart = {
				unitsCount: ShopCartStore.getUnitsCount()
			};
			return data;
		}

		function init($mainEl, data, synchronizer) {
			sync = synchronizer;
			
			events.on('productAddedToCart', _onShopCartUpdated);
			events.on('productRemovedFromCart', _onShopCartUpdated);

			sync.on('showSummaryCart', function(e) {
				e.original.preventDefault();
				events.trigger('toggleSummaryCartRequested');
			});

			console.log('MiniCartController initialized!');
		}

		return {
			setup: setup,
			init: init,
			templateName: 'partials/mini-cart'
		};


		/*var MiniCartController = BaseController.extend({

			templateName: 'partials/mini-cart',

			listeners: {
				showSummaryCart: function (e) {
					e.original.preventDefault();
					events.trigger('toggleSummaryCartRequested');
				}
			},

			setup: function() {
				this.data.shoppingCart = {
					unitsCount: ShopCartStore.getUnitsCount()
				};
			},

			init: function() {

				events.on('productAddedToCart', this.shopCartUpdateHandler, this);
				events.on('productRemovedFromCart', this.shopCartUpdateHandler, this);

				console.log('MiniCartController initialized!');
			},

			shopCartUpdateHandler: function() {
				this.sync.set('shoppingCart.unitsCount', ShopCartStore.getUnitsCount());
			}
		});

		return MiniCartController;*/
	});

}());