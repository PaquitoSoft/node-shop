(function() {
	// ProductDetailController
	define(['jquery', 'plugins/events-manager', 'plugins/local-storage'], function($, events, storage) {

		var $mainImg, $sizeSelector, $colorSelector, $shopCartBtn,
			productId,
			productCategoryId;

		
		function configureProductsNavigation($productsNavigation) {
			var selectedCategoryProductId = storage.retrieve('selectedCategoryProductId'),
				currentCategoryProductsIds = storage.retrieve('currentCategoryProductsIds');

			// TODO Disable navigation on edges
			if (currentCategoryProductsIds && selectedCategoryProductId) {
				$productsNavigation.on('click', '._nav-link', function(e) {
					e.preventDefault();
					
					var $link = $(this),
						idIndex = currentCategoryProductsIds.indexOf(productId),
						nextUrl;
					
					if (idIndex !== -1) {
						$link.hasClass('left') ? idIndex-- : idIndex++;
						if (idIndex >= 0 && idIndex < currentCategoryProductsIds.length) {
							nextUrl = window.location.href.replace(
								/(product\/)(\d*)(\/)(.*)/, '$1' +
								currentCategoryProductsIds[idIndex] +
								'$3');
							window.location.href = nextUrl;
						}
					}

				});
			} else {
				// TODO Disable instead of hide
				$productsNavigation.addClass('hidden');
			}
		}

		function addProductToCart($form) {
			$.post($form.attr('action'), 
				{
					colorId: $sizeSelector.find('option:selected').attr('value'),
					sizeId: $colorSelector.find('option:selected').attr('value'),
					categoryId: productCategoryId
				})
				.done(function(resp) {
					console.log('ProductDetailController: Product added to cart!');
					events.trigger('productAddedToCart');
					$shopCartBtn.removeClass('hidden');
				})
				.fail(function() {
					console.log('Error adding product:', arguments);
				});
		}

		function configure($mainElement) {
			$mainImg = $mainElement.find('#feature-image');
			$sizeSelector = $mainElement.find('#product-select-option-1');
			$colorSelector = $mainElement.find('#product-select-option-0');
			$shopCartBtn = $mainElement.find('#shop');
			productId = $mainElement.attr('data-productId');
			productCategoryId = $mainElement.attr('data-categoryId');

			// Configure images switching
			$mainElement.on('click', '#gallery ._thumb', function(e) {
				e.preventDefault();
				$mainImg.attr('src', $(this).find('img').attr('src'));
			});

			// Configure products navigation
			configureProductsNavigation($mainElement.find('.products-navigation'));

			// Configure product addition
			$mainElement.find('#product-form').on('submit', function(e) {
				e.preventDefault();
				addProductToCart($(this));
			});

			console.log('ProductDetailController initialized!');
		}

		return {
			init: configure
		};

	});
}());