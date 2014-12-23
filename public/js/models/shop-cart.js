(function() {
	'use strict';

	// Shop Cart model
	define(function() {
		
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
				return this.orderItems.orderItems.reduce(function(total, orderItem) {
					return total + orderItem.quantity;
				}, 0);
			}
		});

		ShopCart.prototype.addProduct = function(product, colorId, sizeId) {
			var prevItemIndex = -1,
				orderItem = {
					skuId: product._id + '#' + colorId + '#' + sizeId,
					productId: product._id,
					colorId: colorId,
					sizeId: colorId,
					categoryId: product.categoryId,
					name: product.name,
					price: product.price,
					amount: product.price,
					imageUrl: 'http://static.zara.net/photos' + product.colors[0].pictures[0],
					quantity: 1
				};

			this.orderItems.forEach(function (oi, index) {
				if (oi.skuId === orderItem.skuId) {
					prevItemIndex = index;
					return false;
				}
			});
			
			if (prevItemIndex !== -1) {
				this.orderItems[prevItemIndex].quantity += 1;
				this.orderItems[prevItemIndex].amount += product.price;
			} else {
				this.orderItems.push(orderItem);
			}
		};

		return ShopCart;
	});
}());