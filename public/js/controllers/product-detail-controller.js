(function() {
	'use strict';
	// ProductDetailController
	define(
		['jquery', 'ractive', 'plugins/app-context', 'plugins/events-manager', 'plugins/local-storage',
			'models/product', 'stores/shop-cart', 'plugins/templates', 'plugins/router'],
		function($, R, appContext, events, storage, Product, ShopCart, templates, router) {

		var initialized = false;

		var $mainImg, $gallery, $sizeSelector, $colorSelector, $shopCartBtn,
			product, selectedCategoryProductId, currentCategoryProductsIds;
		
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

		function _addProductToCart(product, colorId, sizeId, done) {
			ShopCart.addProduct(product, colorId, sizeId).done(done);
		}


		/* ---------------------------------------------------------------- */


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
			selectedCategoryProductId = storage.retrieve('selectedCategoryProductId');
			currentCategoryProductsIds = storage.retrieve('currentCategoryProductsIds');

			$mainImg = $mainElement.find('#feature-image');
			$gallery = $mainElement.find('#gallery');
			$sizeSelector = $mainElement.find('#product-select-option-0');
			$colorSelector = $mainElement.find('#product-select-option-1');
			$shopCartBtn = $mainElement.find('#shop');
			product = new Product(data.product);
			data.product = new Product(data.product);

			data.selectedColor = data.product.colors[0];
			data.selectedSizeId = data.product.sizes[0].id;
			data.showBuyButton = false;

			// Configure images switching
			// $mainElement.on('click', '#gallery ._thumb', changeMainImage);

			// Configure color change (switch images)
			// configureColorChange();

			// Configure products navigation
			// configureProductsNavigation($mainElement.find('.products-navigation'));

			// Configure product addition
			// $mainElement.find('#product-form').on('submit', function(e) {
			// 	e.preventDefault();
			// 	addProductToCart($(this));
			// });


			$(document).ready(function() {
				var templateGetter,
					sync = function(template) {
						var $mainEl,
							$template = $(template);

						// $mainEl = $template.data('controller') ? $template : $template.find('*[data-controller]');
						$mainEl = $template.find('*[data-controller]').addBack();
						
						var synchronizer = new R({
							el: $mainElement[0],
							template: $mainEl.html(),
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
								_addProductToCart(data.product, data.selectedColor.id, data.selectedSizeId, function() {
									console.log('ProductDetailController: Product added to cart!');
									self.set('showBuyButton', true);
								});
							}
						});

						initialized = true;
						console.log('ProductDetailController initialized!');
					};

				if (!initialized) {
					templateGetter = templates.render;
				} else {
					templateGetter = function(tplName, ctx, done) { done($mainElement); };
				}

				templateGetter('product-detail', data, sync);

			});
		}

		return {
			init: configure
		};

	});
}());