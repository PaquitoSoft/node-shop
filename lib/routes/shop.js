'use strict';

var express = require('express'),
	async = require('async'),
	models = require('../models'),
	categoryTreeLoader = require('../middleware/category-tree-loader');

var shopRouter = express.Router();

function getOrderItem(skuId, cart) {
	return cart.orderItems.filter(function(orderItem) {
		return orderItem.skuId === skuId;
	})[0];
}

function populateOrderItem(orderItem, done) {
	models.Product.findById(orderItem.productId).lean().exec(function(err, product) {
		if (err || !product) return done(err || new Error('Product not found: ' + orderItem.productId));
		var productColor = product.colors.filter(function(color) {
			return color.id == orderItem.colorId;
		})[0];
		orderItem.name = product.name;
		orderItem.price = product.price;
		orderItem.amount = (orderItem.quantity * orderItem.price).toFixed(2);
		orderItem.imageUrl = productColor.pictures[0];
		done(null, orderItem);
	});
}

/* POST Add product to shopping cart */
shopRouter.post('/cart/:productId', function(req, res, next) {
	var cart = req.shoppingCart,
		skuId = req.params.productId + '#' + req.body.colorId + '#' + req.body.sizeId,
		prevOrderItem = getOrderItem(skuId, cart);

	if (prevOrderItem) {
		prevOrderItem.quantity += 1;
	} else {
		// console.log(req.body);
		cart.orderItems.push({
			skuId: skuId,
			productId: parseInt(req.params.productId, 10),
			colorId: parseInt(req.body.colorId, 10),
			sizeId: parseInt(req.body.sizeId, 10),
			categoryId: parseInt(req.body.categoryId, 10),
			quantity: 1
		});
	}

	req.session.cart = cart;	
	res.json({status: 1, shopCartItem: cart.orderItems[cart.orderItems.length - 1]});
});

/* DELETE Remove product from shopping cart */
shopRouter.delete('/cart/:productId', function(req, res, next) {
	var cart = req.shoppingCart,
		skuId = req.params.productId + '#' + req.body.colorId + '#' + req.body.sizeId,
		prevOrderItem = getOrderItem(skuId, cart);

	if (prevOrderItem) {
		// if (prevOrderItem.quantity > 1) {
		// 	prevOrderItem.quantity -= 1;
		// } else {
		// 	cart.orderItems.splice(cart.orderItems.indexOf(prevOrderItem), 1);
		// }
		cart.orderItems.splice(cart.orderItems.indexOf(prevOrderItem), 1);

		req.session.cart = cart;
		res.json({status: 1});

	} else {
		res.status(412).json({status: 0});
	}

});

/* GET shopping cart */
shopRouter.get('/cart', categoryTreeLoader, function(req, res, next) {
	
	if (req.shoppingCart.orderItems.length) {

		async.map(
			req.shoppingCart.orderItems,
			function(orderItem, done) {
				populateOrderItem(orderItem, done);
			},
			function(err, populatedOrderItems) {
				if (err) return next(err);

				var orderTotalAmount = populatedOrderItems.reduce(function (total, oi) {
					return total + (oi.quantity * oi.price);
				}, 0);

				res.conditionalRender('shop-cart', {
					cart: { orderItems: populatedOrderItems },
					orderTotalAmount: orderTotalAmount.toFixed(2)
				});
			});

	} else {
		res.conditionalRender('shop-cart', {
			cart: req.shoppingCart
		});
	}
	
});


module.exports = shopRouter;
