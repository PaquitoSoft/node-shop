(function() {
	'use strict';
	// ProductDetailController
	define(
		['jquery', 'plugins/local-storage', 'plugins/events-manager',
			'models/product', 'stores/shop-cart', 'plugins/router'],
		function($, storage, events, Product, ShopCart, router) {

		var context, sync;
		var selectedCategoryProductId, currentCategoryProductsIds;
		
		function navigate(productId, mode, rEvent) {
			var idIndex = currentCategoryProductsIds.indexOf(productId),
				nextUrl;
			
			rEvent.original.preventDefault();

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
					sync.set('showBuyButton', true);
				});
		}

		function updateMainImage(rEvent) {
			rEvent.original.preventDefault();
			sync.set('mainImage', rEvent.context);
		}

		function updateAllImages(rEvent) {
			setTimeout(function() {
				sync.set('mainImage', context.selectedColor.pictures[0]);
				sync.set('mainColor', context.selectedColor);
			}, 4);
		}

		function setup($mainElement, data) {
			data.product = new Product(data.product);
			data.selectedColor = data.product.colors[0];
			data.selectedSizeId = data.product.sizes[0].id;
			data.showBuyButton = false;

			return data;
		}

		function init($mainElement, data, synchronizer) {
			selectedCategoryProductId = storage.retrieve('selectedCategoryProductId');
			currentCategoryProductsIds = storage.retrieve('currentCategoryProductsIds');
			context = data;
			sync = synchronizer;

			sync.on({
				updateMainImage: updateMainImage,
				updateAllImages: updateAllImages,
				goBack: $.proxy(navigate, null, context.product._id, 'back'),
				goForward: $.proxy(navigate, null, context.product._id, 'forward'),
				addToCart: addProductToCart
			});

			// Ensure corresponding category selected on navigation menu
			events.trigger('UNFOLD_MENU_REQUESTED', {
				subcategoryId: data.product.categoryId
			});

			console.log('ProductDetailController initialized!');
		}

		return {
			setup: setup,
			init: init,
			templateName: 'product-detail'
		};

	});
}());