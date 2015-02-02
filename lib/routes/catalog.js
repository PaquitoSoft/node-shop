'use strict';

var express = require('express'),
	models = require('../models'),
	categoryTreeLoader = require('../middleware/category-tree-loader');

var catalogRouter = express.Router();

catalogRouter.use(categoryTreeLoader);

function _selectCategory(currentCategoryId, categories) {
	categories.forEach(function(cat) {
		if (cat.subcategories && cat.subcategories.length) {
			return _selectCategory(currentCategoryId, cat.subcategories);
		} else if (cat.id == currentCategoryId) {
			return cat.selected = true;
		}
	});
}

catalogRouter.param('categoryId', function(req, res, next, categoryId) {
	res.locals.selectedCategoryId = categoryId;
	_selectCategory(categoryId, req.categories);
	models.Category.getParentCategory(parseInt(categoryId, 10), function(err, category) {
		if (!err) {
			res.locals.parentCategoryId = category._id;
		}
		next(err);
	});
});

/* GET category page */
catalogRouter.get('/category/:categoryId/:categoryName?', function(req, res, next) {
	models.Product.findByCategory(parseInt(req.params.categoryId, 10), function(err, products) {
		if (err) return next(err);

		// Only pass one image per product to client (when xhr requests)
		products = products.map(function(product) {
			product.colors.forEach(function (color) {
				color.pictures = [color.pictures[0]];
			});
			return product;
		});

		res.conditionalRender('category', {
			catName: req.params.categoryName,
			products: products,
			currentCategoryId: parseInt(req.params.categoryId, 10),
			docTitle: req.params.categoryName,
			mainBanner: "Free shipping on all orders over $75"
		});
	});
});

/* GET product page */
catalogRouter.get('/category/:categoryId/product/:productId/:productName?', function(req, res, next) {
	models.Product.findById(parseInt(req.params.productId), function(err, product) {
		if (err) {
			return next(err);
		}

		res.conditionalRender('product-detail', {
			categoryId: req.params.categoryId,
			product: product.toJSON(),
			mainImage: product.colors[0].pictures[0],
			mainColor: product.colors[0],
			docTitle: product.name,
			mainBanner: "You may return purchased products with no costs."
		});
	});
});

module.exports = catalogRouter;
