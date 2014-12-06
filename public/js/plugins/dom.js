(function() {
	// DOM plugin
	define(function() {

		function findById(id) {
			return document.getElementById(id);
		}
		
		function findEl(selector, $context) {
			return ($context || document).querySelector(selector);
		}
		
		function findEls(selector, $context) {
			return ($context || document).querySelectorAll(selector);
		}

		function iterateEls(elements, callback) {
			[].forEach.call(elements, callback);
		}

		return {
			findById: findById,
			findEl: findEl,
			findEls: findEls,
			iterateEls: iterateEls
		}

	});
}());