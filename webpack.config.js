module.exports = {
	entry: './public/js/main-react.js',
	output: {
		path: './public/js/dist',
		filename: 'app-dist.js',
		publicPath: '/'
	},
	devtool: 'source-map',
	devServer: {
		inline: true,
		contentBase: './public'
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /(node_modules|bower_components)/,
				loader: 'babel',
				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	}
};
