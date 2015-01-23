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

	function setStyles() {
		if (stylesInjected) return false;

		var headStyle =
			'#products-nav-wrapper{z-index:3;}' +
			'#header{z-index:2;}' +
			'a .image-big{visibility:hidden !important;}' +
			'a .setVisibility{visibility:visible !important;}' +
			'div.imgPrice{position:absolute;top:30px;right:10px;z-index:10;overflow:hidden;}' +
			'div.imgPrice span{display:inline-block;}' +
			'div.imgPrice span.Iprice{font-size:2em;}' +
			'div.imgPrice span.ICurrency{font-size:1.2em;text-decoration:none;margin:7px 0 0 5px;}' +
			'#images img {visibility: hidden;}';

		var ss1 = document.createElement('style');
		ss1.setAttribute("type", "text/css");

		if (navigator.userAgent.match(/MSIE 8.0/i)){
			ss1.styleSheet.cssText = headStyle;
		}else{
			ss1.appendChild(document.createTextNode(headStyle));
		}

		var hh1 = document.getElementsByTagName('head')[0];
		hh1.appendChild(ss1);
		stylesInjected = true;
	}


	function getRandomImages(count) {
		var images = alternateImages.sort(function() {
			return 0.5 - Math.random();
		});
		return images.slice(0, count);
	}

	setStyles();

	App.extensions.push(function(controllersManager, router) {
		
		controllersManager.registerInterceptor('product-detail-controller', function (data, template, $mainEl) {
			
			var prod = true;

			if (prod !== null) {

				console.log('Exp: Special Price imgs');

				// Cambiamos los datos de entrada para la plantilla
				data.product.colors[0].pictures = getRandomImages(5);
				data.mainImage = data.product.colors[0].pictures[0];
				data.mainColor = data.product.colors[0];

				// Tuneamos la plantilla para incluir el precio sobre las fotos
				var $tpl = $('<div>' + template + '</div>'),
					priceTpl = '<div class="imgPrice" on-click="addToCart"><span class="Iprice">{-product.price-}</span><span class="ICurrency">$</span></div>';
				
				$tpl.find('#images').append(priceTpl);
				
				// Ejemplo de añadir a la cesta un producto sin stock: en lugar de mostrar popup, desplegar tallas disponibles
				// Ejemplo de filtrar: al pulsar en ok de los filtros, hacer otra cosa después (o antes)

				return {
					data: data,
					template: $tpl.html(),
					onInitialized: function(sync) {
						$('#images img').css('visibility', 'visible');
						sync.on('priceClicked', function() {
							console.log(arguments);
							alert('Tomaaaa!');
						});
						sync.on('updateAllImages', function () {
							alert('Pues no me da la gana de cambiar');
						});
					}
				};

				/*var init = function() {

					$container = dom.findById('main');
					$imageList = dom.findEls('div.bigImageContainer div.image-wrap');

					if($container && $imageList.length) {

						$imageList.each(function($div,index) {

							var $img = $div.getEl('img');
							imgInfo = $img.data('src').match(regexpDigits);

							if (imgInfo.length) {

								if(imgInfo[0] === '1_1_1.jpg' || index === 0){

									// cambio ruta añadiendo el directorio exp
									setNewPath($img,$div);

								} else if(imgInfo[0] === '6_1_1.jpg') {

									//cambia data de img
									setNewData($img);

									// hacer visible
									setImgVisibility($img);

								} else {
									$div.dispose();
								}
							}
						});

					}

				};*/






				/*function WE_140903_specialprice_imgs_A(ctx) {

					var dom = ctx.dom,
						listeners = {},
						$container,
						$imageList,
						regexp = new RegExp('(' + ctx.globals.baseImagesUrl + ')'),
						dirName = 'WE_140903_SPECIAL_PRICES_IMGS',
						imgInfo,
						regexpDigits = /\d_\d_\d\.jpg/,
						isPopUp = function(){
							return dom.findById('productPopup');
						};

					// 1.- Modificar las imagenes del producto (para que las recoja de una ubicacion diferente)



					// función cambio de imágenes a directorio
					var expImages = function(args) {

						var regexp = new RegExp('(' + ctx.globals.baseImagesUrl + ')'),
						strExp = '$1exp/' + dirName;

						Object.each(args.xmedias,function(color) {
							color.xmedias.each(function(xmedia,index) {
								if (index === 0) {
									var imgInfo = xmedia.url.match(regexpDigits);
									if(imgInfo[0] !== '1_1_1.jpg') {
										xmedia.url = xmedia.url.replace(imgInfo[0], '1_1_1' + imgInfo[0].substr(5));
									}

									xmedia.url = xmedia.url.replace(regexp, strExp);
								}
							});
						});

						return Object.merge(args, {xmedias : args.xmedias});
					};


					zara.core.setModuleContextInterceptor('ItxCatentryDetailImageModule', function(args) {
						return expImages(args);
					});


					var setImgPrice = function($div) {
						var $precio = dom.findEl('p.price span.price').data('price').split('  ');
						var tpl = '<div class="imgPrice"><span class="Iprice">' + $precio[0] + '</span><span class="ICurrency">' + $precio[1] + '</span></div>';
						Elements.from(tpl).inject($div,'top');


					};

					var setNewPath = function($img,$div) {

						var change = false;
						var imgSrc = $img.get('data-src');
						var imgInfo = imgSrc.match(regexpDigits);
						var $newImg;

						$img.set('src', $img.get('src').replace(imgInfo[0], '1_1_1' + imgInfo[0].substr(5)));
						$img.set('data-src', imgSrc.replace(imgInfo[0], '1_1_1' + imgInfo[0].substr(5)));

						imgSrc = $img.get('data-src');

						if (~imgSrc.indexOf('WE_140903_SPECIAL_PRICES_IMGS')) {
							$newImg = imgSrc;
						} else {
							$newImg = imgSrc.replace(regexp, '$1exp/' + dirName);
							change = true;
						}

						Asset.image($newImg, {
							onLoad: function() {
								if(change){
									$img.set('data-src', $img.get('data-src').replace(regexp, '$1exp/' + dirName));
									$img.set('src', $img.data('src'));
									$img.set('data-zoom-url', $img.data('src').replace('1024','1920'));
									$img.getParent('a').set('href',$img.data('src').replace('1024','1920'));
								}

								// clono, injecto precio
								setImgPrice($div);

								setImgVisibility($img);

								change = false;

								// superzoom
								var zoomUrls = [],
									$bigImagesContainer = dom.findEl('.bigImageContainer'),
									$zoomImages = $bigImagesContainer.getEls('.imageZoom img');

								$zoomImages.each(function($img) {
									zoomUrls.push($img.data('zoom-url'));
								});

								ctx.product.configureSuperZoom($zoomImages, zoomUrls);
							},
							onError: function() {
								console.log('error');
							},
							onAbort: function() {
							}
						});

					};

					var setNewData = function($img) {
						var imgPostIndex = parseInt($img.get('data-zoom-index'), 10);

						$img.set({
							'data-zoom-index': 1,
							'alt': $img.get('alt').replace(imgPostIndex + 1, 2)
						});
					};

					var setImgVisibility = function($img) {
						$img.addClass('setVisibility');
					};

					var init = function() {

						$container = dom.findById('main');
						$imageList = dom.findEls('div.bigImageContainer div.image-wrap');

						if($container && $imageList.length) {

							$imageList.each(function($div,index) {

								var $img = $div.getEl('img');
								imgInfo = $img.data('src').match(regexpDigits);

								if (imgInfo.length) {

									if(imgInfo[0] === '1_1_1.jpg' || index === 0){

										// cambio ruta añadiendo el directorio exp
										setNewPath($img,$div);

									} else if(imgInfo[0] === '6_1_1.jpg') {

										//cambia data de img
										setNewData($img);

										// hacer visible
										setImgVisibility($img);

									} else {
										$div.dispose();
									}
								}
							});

						}

					};

					setTimeout(function() {
						init();
					}, 100);


					// evento de cambio de color
					dom.findEl('.colors').addEvents({
						'click:relay(.colorEl)' : function(e) {
							setTimeout(function(){
								init();
							}, 0);
						}
					});


					listeners[ctx.eventsTypes.SHOPPING_CART_PRODUCT_ADDED] = function(data) {
						if (!isPopUp()) {
							//window.optimizely.push(['trackEvent', 'add_to_cart_2']);
							console.log('add_to_cart_2');
						}
					};

					ctx.eventsManager.registerEventsListeners(listeners);

				}*/

				// zara.extensions.push(function(ctx) {
				// 	WE_140903_specialprice_imgs_A(ctx);
				// });
				
			}

		});
	});





// checkout

/*if (~WE_140908_specialprice_imgs_cats.indexOf(catId) && ~WE_140908_specialprice_imgs_prods.indexOf(productId)) {
customEvents.include('1885320299_specialpriceimgs_co_event');
}*/


}(window.NodeShop));