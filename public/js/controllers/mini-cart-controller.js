(function() {
	'use strict';

	// MiniCartController
	define(['plugins/events-manager', 'stores/shop-cart', 'controllers/base-controller'], function(events, ShopCartStore, BaseController) {

		var MiniCartController = BaseController.extend({

			templateName: 'partials/mini-cart',

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
			},

			onShowSummaryCart: function (e) {
				e.original.preventDefault();
				events.trigger('toggleSummaryCartRequested');
			}
		});

		return MiniCartController;
	});

}());