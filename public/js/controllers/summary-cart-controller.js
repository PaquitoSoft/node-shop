(function() {
	'use strict';

	// SummaryCartController
	define(['plugins/events-manager', 'plugins/router', 'stores/shop-cart', 'controllers/base-controller'],
		function(events, router, ShopCartStore, BaseController) {

		var SummaryCartController = BaseController.extend({
			templateName: 'partials/mini-shop-cart-items',
			
			setup: function() {
				this.data.orderItems = ShopCartStore.getOrderItems();
			},

			init: function() {
				events.on('toggleSummaryCartRequested', this.toggle, this);
				events.on('productAddedToCart', this.productAddedToCartHandler, this);

				console.log('SummaryCartController initialized!');
			},

			onDeleteOrderItem: function(rEvent) {
				var self = this;
				rEvent.original.preventDefault();

				ShopCartStore.removeOrderItem(this.data.orderItems.indexOf(rEvent.context))
					.done(function (orderItems) {
						self.sync.set('ordetItems', orderItems);
					});
			},

			onGoToShopCart: function (rContext, shopCartUrl) {
				rContext.original.preventDefault();
				router.navTo(shopCartUrl);
			},

			toggle: function() {
				if (ShopCartStore.getUnitsCount()) {
					// TODO I need to learn how to maniulate main element from ractive
					// (it seems to affect only to its contents -template-)
					this.$mainEl.toggleClass('visible');
				}
			},

			productAddedToCartHandler: function(data) {
				this.sync.set('orderItems', data.orderItems);
			}
		});

		return SummaryCartController;
	});
}());