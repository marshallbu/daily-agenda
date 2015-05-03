var webpack = require('webpack');
var isProduction = process.env.NODE_ENV === 'production';
var path = require('path');
var config = require('./gulp_tasks/utils/config.js');

module.exports = {
  debug: true,
  devtool: '#source-map',
  entry: {
    app: config.src.file.app
	},
  output: {
    path: path.join(__dirname, config.distRoot),
		publicPath: config.distRoot,
		filename: config.dist.file.bundle
	},
  module: {
    preLoaders: [
      { test: /\.js$/, loader: 'source-map' }
    ],
		loaders: [
      { test: /\.json$/, loader: 'json' },
      { test: /\.html$/, loader: 'html' },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader'}
    ]
  },
  resolve: {
    extensions: ['', '.web.js', '.js', '.jsx'],
    modulesDirectories: ['app/scripts', 'node_modules', 'bower_modules'],
    alias: {
		}
  },
  externals: [
  ],
  plugins: [
    new webpack.DefinePlugin({
      PRODUCTION: !!isProduction
    }),
    new webpack.ProvidePlugin({
		}),
    new webpack.optimize.DedupePlugin(),
    // getting rid of annoying warning in moment, we of course want locales
    // in prod, this would probably be...
    // new webpack.ContextReplacementPlugin(/path/to/moment[\/\\]locale$/, /en|fr/),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
	]
};
