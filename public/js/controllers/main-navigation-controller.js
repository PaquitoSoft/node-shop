(function() {
	'use strict';

	// MainNavigationController
	define(['jquery', 'plugins/events-manager'], function($, events) {
		var $mainMenu;

		function _foldMenu() {
			$mainMenu.find('.accordion-content').addClass('invisible');
		}

		function _selectCategory(data) {
			var $category = $mainMenu.find('[data-categoryId="' + data.categoryId + '"]');

			_foldMenu();
			
			if (!$category.hasClass('_rootCategory')) {
				$mainMenu.find('.accordion-content a').removeClass('selected');
				$category.addClass('selected');
				$category = $category.parents('li').find('._rootCategory');
			}

			$category.siblings('.accordion-content').removeClass('invisible');
		}

		function onCategoryClick (event) {
			_selectCategory({ categoryId: $(event.target).data('categoryid') });
		}

		function configure() {
			$mainMenu = $('#main-menu');
			
			$mainMenu.on('click', '[data-categoryId]', onCategoryClick);

			events.on('FOLD_MENU_REQUEST', _foldMenu);

			events.on('SELECT_MENU_CATEGORY_REQUEST', _selectCategory);

			console.log('MainNavigationController initialized!');
		}

		return {
			init: configure
		};

	});
}());