var webpack = require('webpack'),
    isProduction = process.env.NODE_ENV === 'production',
    path = require("path"),
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
            { test: /\.js$/, loader: "source-map" }
        ],
		loaders: [
            { test: /\.json$/, loader: 'json' },
            { test: /\.html$/, loader: 'html' }
        ]
    },
    resolve: {
        modulesDirectories: ['app/scripts', 'node_modules', 'bower_modules'],
        // packageAlias: false,
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
        new webpack.optimize.DedupePlugin()

	]
};
