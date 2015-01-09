(function() {
	'use strict';

	// ProductsGridController
	define(['jquery', 'ractive', 'plugins/local-storage', 'plugins/templates'], function($, R, storage, templates) {

		// var template =
		// 	'{-#each products:index-}' +
		// 		'<div class="four columns">' +
		// 			'<a href="/catalog/category/{-categoryId-}/product/{-_id-}/{-name-}" data-id="{-_id-}" class="__animated __fadeInUpBig _product-summary">' +
		// 				'<img src="http://static.zara.net/photos{-colors[0].pictures[0]-}" alt="Blue ripped jeans" class="product" />' +
		// 				'<h3>Name: {-name-}</h3>' +
		// 				'<h4>${-price-} </h4>' +
		// 			'</a>' +
		// 		'</div>' +
		// 		'{-#if (index + 1) % 3 === 0-}' +
		// 			'<br class="clear">' +
		// 		'{-/if-}' +
		// 	'{-/each-}';

		function configure($mainEl, data) {
			console.log('ProductsGridController initialized!', $mainEl[0]);

			$mainEl.on('click', '._product-summary', function(e) {
				
				storage.store('selectedCategoryProductId', $(this).attr('data-id'));

				// TODO Should read products ids from an app context repository
				var categoryProductsIds = $mainEl.find('._product-summary').map(function() {
					return $(this).attr('data-id');
				});

				storage.store('currentCategoryProductsIds', categoryProductsIds.toArray());
			});

			$(document).ready(function() {
				
				var tpl = $mainEl.data('controller') ? $mainEl.html() : $mainEl.find('*[data-controller]').html();
				console.log('----> Ractive for products-grid craeted!');
				var synchronizer = new R({
					el: $mainEl[0],
					template: tpl,
					data: data,
					delimiters: ['{-', '-}']
				});
				console.log('<---- Ractive for products-grid craeted!');
				$mainEl.css('visibility', 'visible');

			});

		}

		return {
			init: configure
		};

	});
}());