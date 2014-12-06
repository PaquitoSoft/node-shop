'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var colorSchema = new Schema({
	name: String,
	image: String,
	pictures: [String]
});

var sizeSchema = new Schema({
	name: String,
	stock: String
});

var productSchema = new Schema({
	name: String,
	price: Number,
	// imageUrl: String,
	categoryId: Number,
	description: String,
	colors: [colorSchema],
	sizes: [sizeSchema]
}, { _id: false });

// TODO
productSchema.statics.findFeatured = function _findFeatured(count, done) {
	this.find({}).lean().limit(count).exec(done);
};

productSchema.statics.findByCategory = function _findByCategory(categoryId, done) {
	this.find({
		categoryId: categoryId
	}).lean().exec(done);
};

module.exports = mongoose.model('Product', productSchema);