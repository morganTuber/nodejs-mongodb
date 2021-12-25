const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const environment = process.env.NODE_ENV ?? 'development'
/**
 * @type import('webpack').Configuration
 */
console.log(environment)
module.exports = {
	entry: {
		server: path.resolve(__dirname, 'src/index.ts'),
	},
	mode: environment,
	target: 'node',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].bundle.js',
		clean: true,
	},
	resolve: {
		extensions: ['.ts', '.js'],
		plugins: [new TsconfigPathsPlugin()],
	},
	externals: [
		nodeExternals({
			allowlist: ['axios'],
		}),
	],
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: ['ts-loader'],
			},
		],
	},
	watch: environment === 'development',
	optimization: {
		emitOnErrors: false,
	},
}
