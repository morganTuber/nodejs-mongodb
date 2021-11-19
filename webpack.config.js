const path = require('path')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

const { NODE_ENV = 'production' } = process.env
/**
 * @type import('webpack').Configuration
 */
module.exports = {
    entry: './src/index.ts',
    mode: NODE_ENV,
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
        plugins: [new TsconfigPathsPlugin()],
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: ['ts-loader'],
            },
        ],
    },
    watch: NODE_ENV === 'development',
    optimization: {
        emitOnErrors: false,
    },
}
