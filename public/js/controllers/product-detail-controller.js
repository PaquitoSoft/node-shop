(function() {
	// ProductDetailController
	define(['jquery', 'plugins/events-manager', 'plugins/local-storage'], function($, events, storage) {

		var $mainImg, $sizeSelector, $colorSelector, $shopCartBtn,
			productData;
		

		function configureProductsNavigation($productsNavigation) {
			var selectedCategoryProductId = storage.retrieve('selectedCategoryProductId'),
				currentCategoryProductsIds = storage.retrieve('currentCategoryProductsIds');

			// TODO Disable navigation on edges
			if (currentCategoryProductsIds && selectedCategoryProductId) {
				$productsNavigation.on('click', '._nav-link', function(e) {
					e.preventDefault();
					
					var $link = $(this),
						idIndex = currentCategoryProductsIds.indexOf(productData._id.toString()),
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
				// TODO Disable instead of hide?
				$productsNavigation.addClass('hidden');
			}
		}

		function addProductToCart($form) {
			var colorId = $colorSelector.find('option:selected').attr('value'),
				sizeId = $sizeSelector.find('option:selected').attr('value');

			$.post($form.attr('action'), 
				{
					colorId: colorId,
					sizeId: sizeId,
					categoryId: productData.categoryId
				})
				.done(function(resp) {
					console.log('ProductDetailController: Product added to cart!');
					var shopCartItem = resp.shopCartItem;
					shopCartItem.name = productData.name;
					shopCartItem.price = productData.price;
					shopCartItem.amount = 1;
					shopCartItem.imageUrl = $mainImg.attr('src');

					events.trigger('productAddedToCart', { shopCartItem: shopCartItem });
					$shopCartBtn.removeClass('hidden');
				})
				.fail(function() {
					console.log('Error adding product:', arguments);
				});
		}

		function changeMainImage(event) {
			event.preventDefault();
			$mainImg.attr('src', $(this).find('img').attr('src'));
		}

		function configure($mainElement, data) {
			$mainImg = $mainElement.find('#feature-image');
			$sizeSelector = $mainElement.find('#product-select-option-0');
			$colorSelector = $mainElement.find('#product-select-option-1');
			$shopCartBtn = $mainElement.find('#shop');
			productData = data.product;
			
			// Configure images switching
			$mainElement.on('click', '#gallery ._thumb', changeMainImage);

			// TODO Configure color change (switch images)

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