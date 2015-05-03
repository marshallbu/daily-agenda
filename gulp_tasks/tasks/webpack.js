var gulp = require('gulp');
var isProduction = process.env.NODE_ENV === 'production';
var plugins = require('gulp-load-plugins')();
var webpack = require('webpack');
var webpackConfig = require('./../../webpack.config.js');
var config = require('./../utils/config');

gulp.task('webpack:build', ['lint'], function() {
  var myConfig = Object.create(webpackConfig);
  var webpackCallback = function(err, stats) {
    if(err) {
      throw new plugins.util.PluginError('webpack:build', err);
    }
    plugins.util.log('[webpack:build]', stats.toString({
      colors: true
    }));
  };

  if (isProduction) {
    myConfig.plugins = myConfig.plugins.concat(
      new webpack.optimize.UglifyJsPlugin({
        // mangle: false
      })
      // new webpack.optimize.OccurenceOrderPlugin()
    );
  }

  return gulp.src(config.src.file.app)
    .pipe(plugins.webpack(myConfig, null, webpackCallback))
    .pipe(gulp.dest(config.dist.dir.scripts));

});
