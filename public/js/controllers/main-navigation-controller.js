(function() {
	'use strict';

	// MainNavigationController
	define(['jquery', 'plugins/events-manager'], function($, events) {
		var context,
			sync;

		function selectRootCategory(rEvent) {
			context.categories.forEach(function(category) {
				category.selected = (category._id === rEvent.context._id);
			});
			sync.set('categories', context.categories);
		}

		function selectSubcategory(rEvent) {
			context.categories.forEach(function(rootCategory, i) {
				rootCategory.subcategories.forEach(function(subcat, j) {
					subcat.visiting = (subcat.id === rEvent.context.id);
				});
			});
			sync.set('categories', context.categories);
		}

		function foldMenu() {
			selectRootCategory({context: {_id: -1}});
			selectSubcategory({context: {id: -1}});
		}

		function init($mainEl, data, synchronizer) {
			context = data;
			sync = synchronizer;
			
			sync.on({
				selectRootCategory: selectRootCategory,
				selectSubcategory: selectSubcategory
			});

			events.on('FOLDED_MENU_REQUESTED', foldMenu);

			console.log('MainNavigationController initialized!');
		}

		return {
			init: init,
			templateName: 'partials/navigation-menu'
		};

	});
}());