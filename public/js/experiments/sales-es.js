/*_optimizely_evaluate=force */
(function(App) {
	'use strict';

	var headStyle =	'#sidebar {visibility: hidden;}';

	if (~App.expApi.activatedExperiments.indexOf('sales-es')) return false;

	App.expApi.injectStyles('sales-es-exp-styles', headStyle);

	App.expApi.loader(function() {

		var langCurrent = 'es',
			countryCurrent = 'es',
			txtLabel = {
				es : 'CAMISETAS',
				ca : 'REBAIXES',
				gl : 'REBAIXAS',
				eu : 'BEHERAPENAK',
				en : 'SALES'
			},
			objChildren = {
				// es : [ 
				// 	269189, 269214, 493001 
				// ]
				es: {
					269189: 'Mujer',
					269214: 'TRF',
					493001: 'hombre'
				}
			},
			arrChildren = objChildren[countryCurrent];

		function extractSubcategories(subcategoryIds, categories) {
			var result = [];
			categories.forEach(function(category) {
				var i = -1;
				category.subcategories.forEach(function(subcat, index) {
					if (~subcategoryIds.indexOf(subcat.id)) {
						i = index;
					}
				});
				if (~i) {
					result.push(category.subcategories[i]);
					category.subcategories.splice(i, 1);
				}
			});
			return result;
		}

		if (arrChildren) {

			require(['jquery', 'plugins/controllers-manager-2'], function($, controllersManager) {

				controllersManager.registerInterceptor('main-navigation-controller', function(controller, url) {

					controller.on('postSetup', function() {

						var salesCategory = {
								_id: -999,
								name: txtLabel[langCurrent],
								subcategories: []
							},
							currentCategories = this.data.categories;

						salesCategory.subcategories = extractSubcategories(arrChildren.keys(), currentCategories);
						salesCategory.subcategories.forEach(function (subcat) {
							subcat.name = arrChildren[subcat.id];
						});

						if (salesCategory.subcategories.length) {
							this.data.categories.unshift(salesCategory);
						}

					});
          
					controller.on('postInit', function() {
						App.expApi.removeStyles('sales-es-exp-styles');
					});

				});

				App.expApi.activatedExperiments.push('sales-es');
			});

		}
		
	});

}(window.zara));
/* _optimizely_evaluate=safe */