(function() {
	'use strict';

	// MainNavigationController
	define(['jquery', 'plugins/events-manager'], function($, events) {
		var $mainMenu;

		function onRootCategoryClick (event) {
			$mainMenu.find('.accordion-content').addClass('invisible');
			$(event.target).siblings('.accordion-content').removeClass('invisible');
		}

		function onSubcategoryClick(event) {
			$mainMenu.find('.accordion-content a').removeClass('selected');
			$(event.target).addClass('selected');
		}
	
		function configure() {
			$mainMenu = $('#main-menu');
			
			// Configure menu un/folding
			$mainMenu.on('click', 'li > .accordion-button', onRootCategoryClick);

			// Configure subcategory selection highlighting
			$mainMenu.on('click', 'li .accordion-content a', onSubcategoryClick);

			console.log('MainNavigationController initialized!');
		}

		return {
			init: configure
		};

	});
}());