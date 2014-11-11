var webpack = require('webpack');

module.exports = function (config) {
    'use strict';
    config.set({

        basePath: './',

        frameworks: ['mocha', 'chai', 'sinon'],

        webpack: {
    		watch: true,
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
                alias: {
                    jquery: 'jquery/dist/jquery.min',
                    lodash: 'lodash/dist/lodash.min',
                    moment: 'moment/min/moment.min'
                }
            },
            plugins: [
                new webpack.ProvidePlugin({
                    $: 'jquery',
                    jQuery: 'jquery',
                }),
                new webpack.optimize.DedupePlugin(),
                // getting rid of annoying warning in moment, we of course want locales
                // in prod, this should be...
                // new webpack.ContextReplacementPlugin(/path/to/moment[\/\\]locale$/, /en|fr/),
                new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
            ]
    	},

        webpackServer: {
    		stats: {
    			colors: true
    		}
    	},

        // the port used by the webpack-dev-server
        // defaults to "config.port" + 1
        // webpackPort: 1234,

        port: 9876,
        colors: true,
        autoWatch: false,
        singleRun: false,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG,

        browsers: ['PhantomJS'],

        plugins: [
            require('karma-mocha'),
            require('karma-chai'),
            require('karma-sinon'),
            require('karma-coverage'),
            require('karma-webpack'),
            require('karma-mocha-reporter'),
            require('karma-phantomjs-launcher')
        ],

        //Timeout for capturing a browser (in ms).
        captureTimeout: 60000,
        // How long does Karma wait for a message from a browser before disconnecting it (in ms).
        browserNoActivityTimeout: 60000
    });
};
