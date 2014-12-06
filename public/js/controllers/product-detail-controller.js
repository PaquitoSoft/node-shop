(function() {
	// ProductDetailController
	define(['jquery'], function($) {

		
		function configure($mainElement) {
			console.log('This is the main element:', $mainElement);
			var $mainImg = $mainElement.find('#feature-image'),
				$sizeSelector = $mainElement.find('#product-select-option-0'),
				$colorSelector = $mainElement.find('#product-select-option-1');

			// Configure images switching
			$mainElement.on('click', '#gallery ._thumb', function(e) {
				e.preventDefault();
				$mainImg.attr('src', $(this).find('img').attr('src'));
			});

			// Configure product addition
			$mainElement.find('#product-form').on('submit', function(e) {
				e.preventDefault();
				$.post($(this).attr('action'), 
					{
						colorId: $sizeSelector.find('options:selected').attr('value'),
						sizeId: $colorSelector.find('options:selected').attr('value')
					})
					.done(function(resp) {
						console.log('Product added to cart!');
					})
					.fail(function() {
						console.log('Error adding product:', arguments);
					});
			});

			console.log('ProductDetailController initialized!');
		}

		return {
			init: configure
		};

	});
}());