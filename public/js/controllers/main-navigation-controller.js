(function() {
	// MainNavigationController
	define(['jquery'], function($) {

		/*$(document).ready(function() {
			var $mainMenu = $('#main-menu');
			$mainMenu.on('click', 'li > .accordion-button', function() {
				console.log($(this).text());
				$mainMenu.find('.accordion-content').addClass('invisible');
				console.log($(this).siblings('.accordion-content'));
				$(this).siblings('.accordion-content').removeClass('invisible');
			});
		});*/

		function configure() {
			
			// Configure menu un/folding
			var $mainMenu = $('#main-menu');
			$mainMenu.on('click', 'li > .accordion-button', function() {
				$mainMenu.find('.accordion-content').addClass('invisible');
				$(this).siblings('.accordion-content').removeClass('invisible');
			});

			console.log('MainNavigationController initialized!');
		}

		return {
			init: configure
		};

	});
}());