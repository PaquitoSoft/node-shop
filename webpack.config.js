var path = require('path'),
	webpack = require('webpack'),
	CommonsChunkPlugin = require('webpack/lib/optimize/CommonsChunkPlugin');

module.exports = {
	context: process.cwd() + '/public',
	// entry: './js/main.js',
	entry: {
		shared: ['jquery', 'dustjs', 'dustjs-helpers', 'pagejs', 'handlebars',
			'./js/main.js', './js/controllers/summary-cart-controller.js',
			'./js/controllers/product-search-controller.js',
			'./js/controllers/mini-cart-controller.js',
			'./js/controllers/main-navigation-controller.js'],
		home: './js/controllers/home-controller',
		category: './js/controllers/category-controller',
		product: './js/controllers/product-detail-controller',
		shopCart: './js/controllers/shop-cart-controller'
	},
	
	output: {
		// path: './public/js',
		// filename: 'bundle.js'
		path: './public/js/dist',
		filename: "[name].entry.chunk.js"
	},

	resolve: {
		root: [
			path.resolve('public'),
			path.resolve('public/js'),
			path.resolve('public/vendor'),
		],
		modulesDirectories: [
			'vendor'
		],
		alias: {
			jquery: process.cwd() + '/public/vendor/jquery/dist/jquery.js',
			dustjs: process.cwd() + '/public/vendor/dustjs-linkedin/lib/dust.js',
			'dustjs-linkedin': process.cwd() + '/public/vendor/dustjs-linkedin/lib/dust.js',
			'dustjs-helpers': process.cwd() + '/public/vendor/dustjs-linkedin-helpers/lib/dust-helpers.js',
			pagejs: process.cwd() + '/public/vendor/page.js/page.js',
			handlebars: process.cwd() + '/public/vendor/handlebars/handlebars.js'
		}
	},

	module: {
		loaders: [
			{ test: /\.css$/, loader: 'style!css' }
		]
	},

	plugins: [
		new CommonsChunkPlugin({
			name: 'shared',
			filename: 'shared.js',
			minChunks: Infinity
		})
		// new CommonsChunkPlugin('commons.chunk.js')
	]
};
