(function() {
	'use strict';

	// Shop Cart model
	define(['jquery', 'plugins/events-manager', 'plugins/app-context'], function($, events, appContext) {
		
		function ShopCart(data) {
			this.orderItems = data.orderItems || [];
		}

		// Computed properties
		Object.defineProperty(ShopCart.prototype, 'itemsCount', {
			get: function() { 
				return this.orderItems.length;
			}
		});
		Object.defineProperty(ShopCart.prototype, 'unitsCount', {
			get: function() {
				return this.orderItems.reduce(function(total, orderItem) {
					return total + orderItem.quantity;
				}, 0);
			}
		});

		ShopCart.prototype.getOrderItems = function() {
			return this.orderItems;
		}

		ShopCart.prototype.addProduct = function(product, colorId, sizeId) {
			var deferred = $.Deferred(),
				self = this;

			$.post('/shop/cart/' + product._id, 
				{
					colorId: colorId,
					sizeId: sizeId,
					categoryId: product.categoryId
				})
				.done(function(resp) {
					console.log('ShopCart: Product added to cart!');

					var prevItemIndex = -1,
						orderItem = {
							skuId: product._id + '#' + colorId + '#' + sizeId,
							productId: product._id,
							colorId: colorId,
							sizeId: sizeId,
							categoryId: product.categoryId,
							name: product.name,
							price: product.price,
							amount: product.price,
							imageUrl: 'http://static.zara.net/photos' + product.colors[0].pictures[0],
							quantity: 1
						};

					self.orderItems.forEach(function (oi, index) {
						if (oi.skuId === orderItem.skuId) {
							prevItemIndex = index;
							return false;
						}
					});
					
					if (prevItemIndex !== -1) {
						self.orderItems[prevItemIndex].quantity += 1;
						self.orderItems[prevItemIndex].amount += product.price;
					} else {
						self.orderItems.push(orderItem);
					}

					events.trigger('productAddedToCart');

					deferred.resolve();
				})
				.fail(function() {
					deferred.reject();
				});

			return deferred;
		};

		ShopCart.prototype.removeOrderItem = function(orderItemIndex) {
			var deferred = $.Deferred(),
				self = this,
				orderItem = this.orderItems[orderItemIndex];

			if (orderItem) {
				$.ajax({
					url: '/shop/cart/' + orderItem.productId,
					type: 'DELETE',
					data: {
						colorId: orderItem.colorId,
						sizeId: orderItem.sizeId
					}
				})
				.done(function() {
					self.orderItems.splice(orderItemIndex, 1);
					events.trigger('productRemovedFromCart');
					deferred.resolve();
				}).fail(function() {
					deferred.reject();
				});
			} else {
				console.warn('No order item found with index:', orderItemIndex);
				deferred.reject();
			}

			return deferred;
		}

		return new ShopCart(appContext.shopCartData);
	});
}());