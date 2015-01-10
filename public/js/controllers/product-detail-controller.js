(function() {
	'use strict';
	// ProductDetailController
	define(
		['jquery', 'ractive', 'plugins/app-context', 'plugins/events-manager', 'plugins/local-storage',
			'models/product', 'stores/shop-cart', 'plugins/templates', 'plugins/router'],
		function($, R, appContext, events, storage, Product, ShopCart, templates, router) {

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

		function addProductToCart(product, colorId, sizeId, done) {
			ShopCart.addProduct(product, colorId, sizeId).done(done);
		}


		function configure($mainElement, data) {
			selectedCategoryProductId = storage.retrieve('selectedCategoryProductId');
			currentCategoryProductsIds = storage.retrieve('currentCategoryProductsIds');

			data.product = new Product(data.product);
			data.selectedColor = data.product.colors[0];
			data.selectedSizeId = data.product.sizes[0].id;
			data.showBuyButton = false;

			$(document).ready(function() {
				
				var synchronizer = new R({
					el: $mainElement[0],
					template: data.template,
					data: data,
					delimiters: ['{-', '-}']
				});

				$mainElement.css('visibility', 'visible');

				synchronizer.on({
					updateMainImage: function(rEvent, selectedColor) {
						this.set('mainImage', rEvent.context);
					},
					updateAllImages: function(rEvent) {
						var self = this;
						setTimeout(function() {
							self.set('mainImage', data.selectedColor.pictures[0]);
							self.set('mainColor', data.selectedColor);
						}, 4);
					},
					goBack: function() {
						navigate(data.product._id, 'back');
					},
					goForward: function() {
						navigate(data.product._id, 'forward');
					},
					addToCart: function(rEvent) {
						var self = this;
						rEvent.original.preventDefault();
						addProductToCart(data.product, data.selectedColor.id, data.selectedSizeId, function() {
							console.log('ProductDetailController: Product added to cart!');
							self.set('showBuyButton', true);
						});
					}
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