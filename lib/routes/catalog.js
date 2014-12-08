'use strict';

var express = require('express'),
	models = require('../models');

var catalogRouter = express.Router();

catalogRouter.use(function loadCategories(req, res, next) {
	models.Category.find().lean().exec(function(err, categories) {
		if (!err) {
			res.locals.categories = categories;
		}
		next(err);
	});
});

catalogRouter.param('categoryId', function(req, res, next, categoryId) {
	res.locals.selectedCategoryId = categoryId;
	models.Category.getParentCategory(parseInt(categoryId, 10), function(err, category) {
		if (!err) {
			res.locals.parentCategoryId = category._id;
		}
		next(err);
	});
});

/* GET category page */
catalogRouter.get('/category/:categoryId/:categoryName', function(req, res, next) {
	models.Product.findByCategory(parseInt(req.params.categoryId, 10), function(err, products) {
		if (err) return next(err);

		res.render('category', {
			catName: req.params.categoryName,
			products: products	
		});
	});
});

/* GET product page */
catalogRouter.get('/category/:categoryId/product/:productId/:productName', function(req, res, next) {
	// models.Product.findById(require('mongoose').Types.ObjectId(req.params.productId), function(err, product) {
	models.Product.findById(parseInt(req.params.productId), function(err, product) {
		if (err) {
			return next(err);
		}

		res.render('product-detail', {
			product: product.toJSON()
		});
	});
});

module.exports = catalogRouter;
