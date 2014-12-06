'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var categorySchema = new Schema({
	name: String
});

categorySchema.statics.getParentCategory = function _getParentCategory(subcategoryId, done) {
	this.findOne({
		subcategories: {
			$elemMatch: {
				id: subcategoryId
			}
		}
	}).lean().exec(done); // lean() return raw document
};

module.exports = mongoose.model('Category', categorySchema);