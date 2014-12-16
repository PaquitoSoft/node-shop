(function() {
	// SummaryCartController
	define(['jquery', 'plugins/events-manager'], function($, events) {
		var $el;

		function _toggle() {
			$el.toggleClass('visible');	
		}

		function configure($mainEl) {
			$el = $mainEl;

			events.on('toggleSummaryCartRequested', _toggle);

			console.log('SummaryCartController initialized!');
		}

		return {
			init: configure
		};

	});
}());