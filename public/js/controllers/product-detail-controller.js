(function() {
	'use strict';
	// ProductDetailController
	define(
		['plugins/local-storage', 'plugins/events-manager',
			'models/product', 'stores/shop-cart', 'plugins/router', 'controllers/base-controller'],
		function(storage, events, Product, ShopCart, router, BaseController) {

		var ProductDetailController = BaseController.extend({
			templateName: 'product-detail',

			props: ['product', 'mainImage', 'mainColor'],

			setup: function() {
				this.data.product = new Product(this.data.product);
				this.data.selectedColor = this.data.product.colors[0];
				this.data.selectedSizeId = this.data.product.sizes[0].id;
				this.data.showBuyButton = false;
			},

			init: function () {
				this.currentCategoryProductsIds = storage.retrieve('currentCategoryProductsIds');
				
				// Ensure corresponding category selected on navigation menu
				events.trigger('UNFOLD_MENU_REQUESTED', {
					subcategoryId: this.data.product.categoryId
				});

				console.log('ProductDetailController initialized!');
			},

			_onPostUpdate: function() {
				console.log('Datos de producto actualizados!!!');
				events.trigger('UNFOLD_MENU_REQUESTED', {
					subcategoryId: this.data.product.categoryId
				});
			},

			onNavigate: function(rEvent, mode) {
				var idIndex = this.currentCategoryProductsIds.indexOf(this.data.product._id),
					nextUrl;
				
				rEvent.original.preventDefault();

				if (idIndex !== -1) {
					idIndex = (mode === 'back') ? idIndex - 1 : idIndex + 1;
					if (idIndex >= 0 && idIndex < this.currentCategoryProductsIds.length) {
						nextUrl = window.location.pathname.replace(
							/(product\/)(\d*)(\/)(.*)/, '$1' +
							this.currentCategoryProductsIds[idIndex] +
							'$3');
						router.navTo(nextUrl);
					}
				}
			},

			onAddToCart: function(rEvent) {
				var self = this;
				rEvent.original.preventDefault();
				ShopCart.addProduct(this.data.product, this.data.selectedColor.id, this.data.selectedSizeId)
					.done(function() {
						console.log('ProductDetailController: Product added to cart!');
						self.sync.set('showBuyButton', true);
					});
			},

			onUpdateMainImage: function(rEvent) {
				rEvent.original.preventDefault();
				this.sync.set('mainImage', rEvent.context);
			},

			onUpdateAllImages: function(rEvent) {
				var self = this;
				setTimeout(function() {
					self.sync.set('mainImage', self.data.selectedColor.pictures[0]);
					self.sync.set('mainColor', self.data.selectedColor);
				}, 4);
			}
		});

		return ProductDetailController;
	});
}());