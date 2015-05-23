(function() {
	'use strict';

	define(function(require) {
		var $ = require('jquery'),
			Logger = require('plugins/logger'),
			ajax = require('plugins/ajax'),
			errorHandler = require('plugins/error-handler');

		var logger = Logger.createLogger('PaginationWidget');

		function PaginationWidget($el, options) {
			this.$el = $el;
			this.options = $.merge({
				dataSourceUrl: '',
				pageSize: 5,
				maxNumPage: 5,
				onPageChanged: function(){}
			}, options);
			this.currentPage = 0;

			this.$el
				.on('click', '.table-nav-prev', { direction: 'backward' } , $.proxy(this.fetchPage, this))
				.on('click', '.table-nav-next', { direction: 'forward' }, $.proxy(this.fetchPage, this));
			
		}

		$.extend(PaginationWidget.prototype, {
			fetchPage: function(event) {
				var self = this,
					requestPageNumber = (event.data.direction === 'forward') ? this.currentPage++ : this.currentPage--;
				
				if (requestPageNumber < 1 || requestPageNumber > this.options.maxNumPage) {
					return false;
				}

				ajax.getJson({
					url: this.options.dataSourceUrl,
					timeout: 10000, // TODO Carlos: Establecer un timeout por defecto en el plugin de AJAX
					data: {
						start: requestPageNumber * this.options.pageSize // TODO Carlos: Quizás sea mejor dejar el tamaño en el servidor par evitar que nos pidan 1.000 pedidos
					},
					success: function(data) {
						self.onPageChanged(data);
						self.currentPage = requestPageNumber;
						self.$el.find('._current-page').html(self.currentPage + 1);
					},
					error: errorHandler.handleAjaxError // TODO Carlos: Esto debería ser el handler por defecto en el plugin de AJAX
				});

			},
			cleanup: function() {
				this.$el.off();
			}
		});

		return {
			createPaginator: function($el, options) {
				return new PaginationWidget($el, options);
			}
		};
	});

}());

/* --------------------------------------------------------------------------- */

var paginationWidget = require('widgets/pagination-widget');

paginationWidget.createPaginator(this.$mainEl.find('._paginator'), {
	dataSourceUrl: urlBuilder.urlTo('user/order'),
	pageSize: 5,
	maxNumPage: 5,
	onPageChanged: function(data) {
		var self = this;
		templates.render('user/order/_order-list/_order-list-page', data , function(err, html) {
			if(!err) {
				self.$mainEl.empty().append(html);
			}
		});
	}
});
