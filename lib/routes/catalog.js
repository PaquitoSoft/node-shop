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
catalogRouter.get('/category/:categoryId/:categoryName', function(req, res, next) {
	models.Product.findByCategory(parseInt(req.params.categoryId, 10), function(err, products) {
		if (err) return next(err);

		// We only need one picture per product
		if (req.xhr) {
			products = products.map(function(p) {
				p.colors.forEach(function(c) {
					c.pictures = [c.pictures[0]];
				});
				return p;
			});
		}

		res.conditionalRender('category', {
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

		res.conditionalRender('product-detail', {
			categoryId: req.params.categoryId,
			product: product.toJSON()
		});
	});
});

/* GET categories tree */
catalogRouter.get('/categories', (req, res, next) => {
	models.Category.find().lean().exec((err, categories) => {
		if (err) return next(err);

		res.json(categories);
	});
});

/* GET features products */
catalogRouter.get('/featured-products', (req, res, next) => {
	models.Product.findFeatured(9, (err, data) => {
		if (err) return next(err);

		res.json({
			products: data
		});
	});
});

module.exports = catalogRouter;
