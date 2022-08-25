const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const APP_SOURCE = path.join(__dirname, 'src')

exports.loadJavascript = () => ({
	module: {
		rules: [
			{
				test: /\.js$/,
				include: APP_SOURCE,
				exclude: path => path.match(/node_modules/),
				use: 'babel-loader'
			}
		]
	}
})

exports.extractCSS = ({ options = {}, loaders = [] } = {}) => {
	return {
		module: {
			rules: [
				{
					test: /\.css$/,
					use: [
						{ loader: MiniCssExtractPlugin.loader, options },
						'css-loader'
					].concat(loaders),
					sideEffects: true
				}
			]
		},
		plugins: [
			new MiniCssExtractPlugin({
				filename: '[name].css'
			})
		]
	}
}
