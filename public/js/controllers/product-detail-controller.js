(function() {
	'use strict';
	// ProductDetailController
	define(
		['jquery', 'plugins/app-context', 'plugins/events-manager', 'plugins/local-storage',
			'models/product', 'stores/shop-cart', 'plugins/templates', 'plugins/router'],
		function($, appContext, events, storage, Product, ShopCart, templates, router) {

		var $mainImg, $gallery, $sizeSelector, $colorSelector, $shopCartBtn,
			product;
		

		function configureProductsNavigation($productsNavigation) {
			var selectedCategoryProductId = storage.retrieve('selectedCategoryProductId'),
				currentCategoryProductsIds = storage.retrieve('currentCategoryProductsIds');

			// TODO Disable navigation on edges
			if (currentCategoryProductsIds && selectedCategoryProductId) {
				$productsNavigation.on('click', '._nav-link', function(e) {
					e.preventDefault();
					
					var $link = $(this),
						idIndex = currentCategoryProductsIds.indexOf(product._id.toString()),
						nextUrl;
					
					if (idIndex !== -1) {
						$link.hasClass('left') ? idIndex-- : idIndex++;
						if (idIndex >= 0 && idIndex < currentCategoryProductsIds.length) {
							nextUrl = window.location.pathname.replace(
								/(product\/)(\d*)(\/)(.*)/, '$1' +
								currentCategoryProductsIds[idIndex] +
								'$3');
							router.navTo(nextUrl);
						}
					}

				});
			} else {
				// TODO Disable instead of hide?
				$productsNavigation.addClass('hidden');
			}
		}

		function configureColorChange() {
			$colorSelector.on('change', function (event) {
				var colorData = product.getColor($colorSelector.find('option:selected').attr('value'));
				$mainImg.attr('src', appContext.photosBasePath + colorData.pictures[0]);
				templates.render('partials/product-images', {
					productImages: colorData.pictures,
					basePath: appContext.photosBasePath
				}, function(html) {
					$gallery.html(html);
				});
			});
		}

		function addProductToCart($form) {
			var colorId = $colorSelector.find('option:selected').attr('value'),
				sizeId = $sizeSelector.find('option:selected').attr('value');

			ShopCart.addProduct(product, colorId, sizeId)
				.done(function() {
					console.log('ProductDetailController: Product added to cart!');
					$shopCartBtn.removeClass('hidden');
				});
		}

		function changeMainImage(event) {
			event.preventDefault();
			$mainImg.attr('src', $(event.target).find('img').attr('src'));
		}

		function configure($mainElement, data) {
			$mainImg = $mainElement.find('#feature-image');
			$gallery = $mainElement.find('#gallery');
			$sizeSelector = $mainElement.find('#product-select-option-0');
			$colorSelector = $mainElement.find('#product-select-option-1');
			$shopCartBtn = $mainElement.find('#shop');
			product = new Product(data.product);
			
			// Configure images switching
			$mainElement.on('click', '#gallery ._thumb', changeMainImage);

			// Configure color change (switch images)
			configureColorChange();

			// Configure products navigation
			configureProductsNavigation($mainElement.find('.products-navigation'));

			// Configure product addition
			$mainElement.find('#product-form').on('submit', function(e) {
				e.preventDefault();
				addProductToCart($(this));
			});

			// Ensure menu is open
			events.trigger('SELECT_MENU_CATEGORY_REQUEST', {categoryId: product.categoryId.toString() });

			console.log('ProductDetailController initialized!');
		}

		return {
			init: configure
		};

	});
}());