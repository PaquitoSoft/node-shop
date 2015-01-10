(function() {
	'use strict';
	// ProductDetailController
	define(
		['jquery', 'ractive', 'plugins/app-context', 'plugins/events-manager', 'plugins/local-storage',
			'models/product', 'stores/shop-cart', 'plugins/templates', 'plugins/router'],
		function($, R, appContext, events, storage, Product, ShopCart, templates, router) {

		var context;
		var synchronizer;
		var selectedCategoryProductId, currentCategoryProductsIds;
		
		function navigate(productId, mode) {
			var idIndex = currentCategoryProductsIds.indexOf(productId.toString()),
				nextUrl;
			
			if (idIndex !== -1) {
				idIndex = (mode === 'back') ? idIndex - 1 : idIndex + 1;
				if (idIndex >= 0 && idIndex < currentCategoryProductsIds.length) {
					nextUrl = window.location.pathname.replace(
						/(product\/)(\d*)(\/)(.*)/, '$1' +
						currentCategoryProductsIds[idIndex] +
						'$3');
					router.navTo(nextUrl);
				}
			}
		}

		function addProductToCart(rEvent) {
			rEvent.original.preventDefault();
			ShopCart.addProduct(context.product, context.selectedColor.id, context.selectedSizeId)
				.done(function() {
					console.log('ProductDetailController: Product added to cart!');
					synchronizer.set('showBuyButton', true);
				});
		}

		function updateMainImage(rEvent) {
			synchronizer.set('mainImage', rEvent.context);
		}

		function updateAllImages(rEvent) {
			setTimeout(function() {
				synchronizer.set('mainImage', context.selectedColor.pictures[0]);
				synchronizer.set('mainColor', context.selectedColor);
			}, 4);
		}

		function configure($mainElement, data) {
			selectedCategoryProductId = storage.retrieve('selectedCategoryProductId');
			currentCategoryProductsIds = storage.retrieve('currentCategoryProductsIds');

			data.product = new Product(data.product);
			data.selectedColor = data.product.colors[0];
			data.selectedSizeId = data.product.sizes[0].id;
			data.showBuyButton = false;

			context = data;

			$(document).ready(function() {
				
				synchronizer = new R({
					el: $mainElement[0],
					template: data.template,
					data: context,
					delimiters: ['{-', '-}']
				});

				$mainElement.css('visibility', 'visible');

				synchronizer.on({
					updateMainImage: updateMainImage,
					updateAllImages: updateAllImages,
					goBack: $.proxy(navigate, null, context.product._id, 'back'),
					goForward: $.proxy(navigate, null, context.product._id, 'forward'),
					addToCart: addProductToCart
				});

				console.log('ProductDetailController initialized!');

			});
		}

		return {
			init: configure,
			templateName: 'product-detail'
		};

	});
}());