var webpack = require('webpack'),
    isProduction = process.env.NODE_ENV === 'production',
    path = require('path'),
    config = require('./gulp_tasks/utils/config.js');

module.exports = {
    debug: true,
    devtool: '#source-map',
    entry: {
        app: config.src.file.app,
	},
    output: {
		path: path.join(__dirname, config.distRoot),
		publicPath: config.distRoot,
		filename: config.dist.file.bundle,
	},
    module: {
        preLoaders: [
            { test: /\.js$/, loader: 'source-map' }
        ],
		loaders: [
            { test: /\.json$/, loader: 'json' },
            { test: /\.html$/, loader: 'html' },
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader'}
        ]
    },
    resolve: {
        modulesDirectories: ['app/scripts', 'node_modules', 'bower_modules'],
        alias: {
			jquery: 'jquery/dist/jquery.min',
            lodash: 'lodash/dist/lodash.min',
            moment: 'moment/min/moment.min'
		}
    },
    externals: [
    ],
    plugins: [
        new webpack.DefinePlugin({
            PRODUCTION: !!isProduction
        }),
		new webpack.ProvidePlugin({
            $: 'jquery',
			jQuery: 'jquery',
		}),
        new webpack.optimize.DedupePlugin(),
        // getting rid of annoying warning in moment, we of course want locales
        // in prod, this would probably be...
        // new webpack.ContextReplacementPlugin(/path/to/moment[\/\\]locale$/, /en|fr/),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
	]
};
