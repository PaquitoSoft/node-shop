'use strict';

var models = require('../models');

module.exports = function miniCartLoader(req, res, next) {
	var shopCart = req.session.cart || { orderItems: [] };
	shopCart.itemsCount = shopCart.orderItems.length;
	shopCart.unitsCount = shopCart.orderItems.reduce(function(total, orderItem) {
		return total + orderItem.quantity;
	}, 0);
	req.shoppingCart = res.locals.shoppingCart = shopCart;

	next();
};