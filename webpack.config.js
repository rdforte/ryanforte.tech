const path = require('path')
const { merge } = require('webpack-merge')
const parts = require('./webpack.parts')

const commonConfig = merge([
	{
		entry: [path.resolve('src', 'js', 'app.js')],
		output: {
			path: path.resolve('static', 'assets'),
			filename: 'bundle.js'
		}
	},
	parts.loadJavascript()
])

const productionConfig = merge([])
const developmentConfig = merge([])

const config = (_env, argv) => {
	switch (argv.mode) {
		case 'production':
			return merge(commonConfig, productionConfig, { mode: argv.mode })
		case 'development':
			return merge(commonConfig, developmentConfig, { mode: argv.mode })
		default:
			throw new Error(`Trying to use an unknown webpack mode ${argv.mode}`)
	}
}

module.exports = config
