(function() {
	// ProductDetailController
	define(['jquery', 'plugins/events-manager'], function($, events) {

		
		function configure($mainElement) {
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
						colorId: $sizeSelector.find('option:selected').attr('value'),
						sizeId: $colorSelector.find('option:selected').attr('value')
					})
					.done(function(resp) {
						console.log('ProductDetailController: Product added to cart!');
						events.trigger('productAddedToCart');
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