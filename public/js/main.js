(function() {
	'use strict';

	/*
	$(document).ready(function() {
		var $mainMenu = $('#main-menu');

		$mainMenu.on('click', 'li > .accordion-button', function() {
			console.log($(this).text());
			$mainMenu.find('.accordion-content').addClass('invisible');
			console.log($(this).siblings('.accordion-content'));
			$(this).siblings('.accordion-content').removeClass('invisible');
		});

	});
	*/

	requirejs.config({
		baseUrl: '/js',
		paths: {
			jquery: '/vendor/jquery/dist/jquery'
		}
	});
	
	require(['jquery'], function($) {
		var controllers = $('*[data-controller]').map(function(index, elem) {
			return 'controllers/' + $(elem).attr('data-controller');
		});

		console.log('Load controllers:', controllers);
		require(controllers.toArray(), function() {
			$.each(arguments, function(index, controller) {
				try {
					controller.init();
				} catch (e) {
					console.log('Error initializing controller %s: %s', controller, e);
					console.log(e.stack);
				}
			});
		});
	});

}());