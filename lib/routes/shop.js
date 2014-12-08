'use strict';

var express = require('express'),
	models = require('../models');

var shopRouter = express.Router();

shopRouter.use(function loadCategories(req, res, next) {
	req.shoppingCart = req.session.cart || { orderItems: [] };
	next();
});

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
		cart.orderItems.push({
			skuId: skuId,
			productId: req.params.productId,
			colorId: req.body.colorId,
			sizeId: req.body.sizeId,
			quantity: 1
		});
	}

	req.session.cart = cart;	
	res.json({status: 1});
});

/* DELETE Remove product from shopping cart */
shopRouter.delete('/cart/:productId', function(req, res, next) {
	var cart = req.shoppingCart,
		skuId = req.params.productId + '#' + req.body.colorId + '#' + req.body.sizeId,
		prevOrderItem = getOrderItem(skuId, cart);

	if (prevOrderItem) {
		if (prevOrderItem.quantity > 1) {
			prevOrderItem.quantity -= 1;
		} else {
			cart.orderItems.splice(cart.orderItems.indexOf(prevOrderItem), 1);
		}

		req.session.cart = cart;
		res.json({status: 1});

	} else {
		res.json({status: 0});
	}

});

/* GET shopping cart */
shopRouter.get('/cart', function(req, res, next) {
	console.log('Shopping Cart:', req.shoppingCart);
	res.render('shop-cart', {
		cart: req.shoppingCart
	});
});


module.exports = shopRouter;
