'use strict';

var models = require('../models'),
	async = require('async');

function populateOrderItem(orderItem, done) {
	models.Product.findById(orderItem.productId).lean().exec(function(err, product) {
		if (err || !product) return done(err || new Error('Product not found: ' + orderItem.productId));
		var productColor = product.colors.filter(function(color) {
			return color.id == orderItem.colorId;
		})[0];
		orderItem.name = product.name;
		orderItem.price = product.price;
		orderItem.amount = (orderItem.quantity * orderItem.price).toFixed(2);
		if (productColor) {
			orderItem.imageUrl = 'http://static.zara.net/photos' + productColor.pictures[0];
		}
		done(null, orderItem);
	});
}


module.exports = function miniCartLoader(req, res, next) {
	var shopCart = req.session.cart || { orderItems: [] };
	shopCart.itemsCount = shopCart.orderItems.length;
	shopCart.unitsCount = shopCart.orderItems.reduce(function(total, orderItem) {
		return total + orderItem.quantity;
	}, 0);

	async.map(
		shopCart.orderItems,
		function(orderItem, done) {
			populateOrderItem(orderItem, done);
		},
		function(err, populatedOrderItems) {
			shopCart.orderItems = populatedOrderItems;
			req.shoppingCart = res.locals.shoppingCart = shopCart;
			next(err);
		}
	);
};