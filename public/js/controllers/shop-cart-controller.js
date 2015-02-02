(function() {
	'use strict';

	// ShopCartController
	define(['stores/shop-cart', 'controllers/base-controller'], function(ShopCartStore, BaseController) {
		
		var ShopCartController = BaseController.extend({
			templateName: 'shop-cart',

			setup: function() {
				this.data.orderItems = ShopCartStore.getOrderItems();
				this.data.orderTotalAmount = ShopCartStore.getTotalAmount().toFixed(2);
			},

			init: function() {
				// TODO This message should be emmited by controllers manager component
				console.log('ShopCartController initialized!');
			},

			onDeleteOrderItem: function(rEvent) {
				var self = this;
				rEvent.original.preventDefault();

				ShopCartStore.removeOrderItem(this.data.orderItems.indexOf(rEvent.context))
					.done(function (orderItems) {
						self.sync.set({
							orderItems: orderItems,
							orderTotalAmount: ShopCartStore.getTotalAmount().toFixed(2)
						});
					});
			}
		});

		return ShopCartController;
	});
}());