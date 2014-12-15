'use strict';

var express = require('express'),
	models = require('../models'),
	categoryTreeLoader = require('../middleware/category-tree-loader');

var catalogRouter = express.Router();

catalogRouter.use(categoryTreeLoader);

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
catalogRouter.get('/category/:categoryId/product/:productId/:productName?', function(req, res, next) {
	models.Product.findById(parseInt(req.params.productId), function(err, product) {
		if (err) {
			return next(err);
		}

		res.render('product-detail', {
			categoryId: req.params.categoryId,
			product: product.toJSON()
		});
	});
});

module.exports = catalogRouter;
