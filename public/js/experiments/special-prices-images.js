/* _optimizely_evaluate=force */
(function(App) {
	'use strict';

	var stylesInjected = false;

	var alternateImages = [
		'/2014/I/0/2/p/1564/311/805/2/w/560/1564311805_2_3_1.jpg?ts=1402674928487',
		'/2014/I/0/1/p/7520/303/712/2/w/560/7520303712_2_1_1.jpg?ts=1407499172108',
		'/2014/I/0/1/p/0881/211/712/2/w/560/0881211712_2_1_1.jpg?ts=1413804752990',
		'/2014/I/0/1/p/9222/232/800/2/w/560/9222232800_2_4_1.jpg?ts=1407428464252',
		'/2014/I/0/1/p/0518/257/800/2/w/560/0518257800_1_1_1.jpg?ts=1410367555648',
		'/2014/I/0/1/p/4172/152/800/2/w/560/4172152800_1_1_1.jpg?ts=1400862601797',
		'/2014/I/0/1/p/1403/242/804/2/w/560/1403242804_1_1_1.jpg?ts=1407313442106',
		'/2014/I/0/1/p/1599/221/712/2/w/560/1599221712_2_4_1.jpg?ts=1405522278809',
		'/2014/I/0/1/p/1323/209/922/2/w/560/1323209922_2_1_1.jpg?ts=1410780751165',
		'/2014/I/0/1/p/1551/203/250/2/w/560/1551203250_2_2_1.jpg?ts=1401098919760'
	];

	var expStyles = {
		'block-images-exp': '#images img {visibility: hidden;}',
		'special-prices-exp': '#products-nav-wrapper{z-index:3;}' +
			'#header{z-index:2;}' +
			'a .image-big{visibility:hidden !important;}' +
			'a .setVisibility{visibility:visible !important;}' +
			'div.imgPrice{position:absolute;top:30px;right:10px;z-index:10;overflow:hidden;}' +
			'div.imgPrice span{display:inline-block;}' +
			'div.imgPrice span.Iprice{font-size:2em;}' +
			'div.imgPrice span.ICurrency{font-size:1.2em;text-decoration:none;margin:7px 0 0 5px;}'
	};

	function injectStyles(tagId, styles) {
		var styleEl = document.getElementById(tagId);

		if (!styleEl) {
			styleEl = document.createElement('style');
			styleEl.setAttribute('id', tagId);
			styleEl.setAttribute("type", "text/css");

			if (navigator.userAgent.match(/MSIE 8.0/i)){
				styleEl.styleSheet.cssText = styles;
			} else{
				styleEl.appendChild(document.createTextNode(styles));
			}

			document.getElementsByTagName('head')[0].appendChild(styleEl);
		}
	}

	function removeStyles(tagId) {
		var styleEl = document.getElementById(tagId);

		if (styleEl) {
			styleEl.parentNode.removeChild(styleEl);
		}
	}

	function getRandomImages(count) {
		var images = alternateImages.sort(function() {
			return 0.5 - Math.random();
		});
		return images.slice(0, count);
	}

	injectStyles('block-images-exp', expStyles['block-images-exp']);
	injectStyles('special-prices-exp', expStyles['special-prices-exp']);

	function loader(fn) {
		if (document.readyState !== 'complete') {
			App.extensions.push(fn);
		} else {
			fn();
		}
	}
  
	loader(function() {
		
		require(['jquery', 'plugins/controllers-manager-2'], function($, controllersManager) {
      
			controllersManager.registerInterceptor('product-detail-controller', function(controller, url) {
				
				console.log('Altering ProductDetailController...');
				
				controller.setup = function() {

					// Cambiamos los datos de entrada para la plantilla
					this.data.product.colors[0].pictures = getRandomImages(5);
					this.data.mainImage = this.data.product.colors[0].pictures[0];
					this.data.mainColor = this.data.product.colors[0];

					// Tuneamos la plantilla para incluir el precio sobre las fotos
					var $tpl = $('<div>' + this.template + '</div>'),
						priceTpl = '<div class="imgPrice" on-click="priceClicked"><span class="Iprice">{{product.price}}</span><span class="ICurrency">$</span></div>';
					
					$tpl.find('#images').append(priceTpl);
					this.template = $tpl.html();
				};

				controller.on('postInit', function() {
					console.log('POST INIT:', this.$mainEl);
					this.$mainEl.find('#images img').css('visibility', 'visible');
					removeStyles('block-images-exp');

					this.addDomListener('priceClicked', function(rEvent) {
						console.log('onPriceClicked:', rEvent);
						this.$mainEl.find('.product-price').css('border', '2px solid blue');
					});

					this.addDomListener('updateAllImages', function(rEvent) {
						this.$mainEl.find('#feature-image').css('border', '2px solid blue');
						this._super();
					});
				});
				
			});
		});

	});

}(window.zara));
/* _optimizely_evaluate=safe */