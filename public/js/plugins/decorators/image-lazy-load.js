(function() {
	'use strict';

	// Data layer plugin
	define(['jquery', 'ractive'], function($, R) {

		function isElementInViewport (el) {
			var rect = el.getBoundingClientRect();

			return (
				rect.top >= 0 &&
				rect.left >= 0 &&
				rect.top <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
				rect.left <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
			);
		}

		var imageLazyLoadDecorator = function(node, content) {
			var $el = $(node);

			var handlers = {
				loadElementImage: function() {
					if (!$el.data('loaded') && isElementInViewport($el[0])) {
						$el.attr('src', $el.data('src'));
						$el.data('loaded', true);
					}
				}
			};

			// Listen to scroll in order to detect images which gets into the viewport
			$(window).on('scroll', handlers.loadElementImage);

			// Check now
			handlers.loadElementImage();

			return {
				teardown: function() {
					$(window).off('scroll', handlers.loadElementImage);

				}
			};
		};

		R.decorators.imageLazyLoader = imageLazyLoadDecorator;
	});
}());