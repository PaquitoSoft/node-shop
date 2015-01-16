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
	
	var orderTotalAmount = req.shoppingCart.orderItems.reduce(function (total, oi) {
		return total + (oi.quantity * oi.price);
	}, 0);

	res.render('shop-cart', {
		cart: { orderItems: req.shoppingCart.orderItems },
		orderTotalAmount: orderTotalAmount.toFixed(2)
	});
});


module.exports = shopRouter;
