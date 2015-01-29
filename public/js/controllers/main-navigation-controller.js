(function() {
	'use strict';

	// MainNavigationController
	define(['plugins/events-manager', 'controllers/base-controller'], function(events, BaseController) {

		var MainNavigationController = BaseController.extend({

			templateName: 'partials/navigation-menu',
			
			init: function() {
				this.selectSubcategory(this.data.currentCategoryId);
				
				events.on('FOLDED_MENU_REQUESTED', this.foldMenu, this);
				events.on('UNFOLD_MENU_REQUESTED', function (data) {
					this.selectSubcategory(data.subcategoryId);
				}, this);

				console.log('MainNavigationController initialized!');
			},

			onSelectRootCategory: function(rEvent) {
				this.sync.set('rootCategoryId', rEvent.context._id);
			},

			onSelectSubcategory: function(rEvent) {
				this.selectSubcategory(rEvent.context.id);
			},

			foldMenu: function() {
				this.sync.set({
					rootCategoryId: -1,
					subcategoryId: -1
				});
			},

			selectSubcategory: function(subCatId) {
				var i, j, jLen, subcat,
					categories = this.data.categories,
					iLen = categories.length;

				outer:
				for (i = 0; i < iLen; i++) {
					jLen = categories[i].subcategories.length;
					inner:
					for (j = 0; j < jLen; j++) {
						subcat = categories[i].subcategories[j];
						if (subcat.id === subCatId) {
							this.sync.set('rootCategoryId', categories[i]._id);
							this.sync.set('subcategoryId', subcat.id);
							break outer;
						}
					}
				}

				this.sync.set('categories', categories);
			}
		});

		return MainNavigationController;
	});
}());