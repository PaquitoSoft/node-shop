(function() {
	'use strict';

	// MainNavigationController
	define(['jquery', 'plugins/events-manager'], function($, events) {
		var context,
			sync;

		function selectRootCategoryHandler(rEvent) {
			sync.set('rootCategoryId', rEvent.context._id);
		}

		function selectSubcategoryHandler(rEvent) {
			selectSubcategory(rEvent.context.id);
		}

		function selectSubcategory(subCatId) {
			var i, j, jLen, subcat,
				iLen = context.categories.length;

			outer:
			for (i = 0; i < iLen; i++) {
				jLen = context.categories[i].subcategories.length;
				inner:
				for (j = 0; j < jLen; j++) {
					subcat = context.categories[i].subcategories[j];
					if (subcat.id === subCatId) {
						sync.set('rootCategoryId', context.categories[i]._id);
						sync.set('subcategoryId', subcat.id);
						break outer;
					}
				}
			}

			sync.set('categories', context.categories);
		}

		function foldMenu() {
			sync.set('rootCategoryId', -1);
			sync.set('subcategoryId', -1);
		}

		function init($mainEl, data, synchronizer) {
			context = data;
			sync = synchronizer;
			
			selectSubcategory(data.currentCategoryId);

			sync.on({
				selectRootCategory: selectRootCategoryHandler,
				selectSubcategory: selectSubcategoryHandler
			});

			events.on('FOLDED_MENU_REQUESTED', foldMenu);
			events.on('UNFOLD_MENU_REQUESTED', function (data) {
				selectSubcategory(data.subcategoryId);
			});

			console.log('MainNavigationController initialized!');
		}

		return {
			init: init,
			templateName: 'partials/navigation-menu'
		};

	});
}());