var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var log = require('./../utils/log');
var pkgjson = require('./../../package.json');
var moment = require('moment');
var config = require('./../utils/config');

gulp.task('process-html', ['partial-compile'], function() {
  return gulp
    .src(config.src.glob.html)
    .pipe(plugins.preprocess({
      context: {
        'COPY_YEAR': moment().format('YYYY'),
        'APP_VERSION': pkgjson.version,
        'TARGET': process.env.NODE_ENV ? process.env.NODE_ENV : 'development',
        DEBUG: true
      }
    }))
    .pipe(gulp.dest(config.dist.dir.root));
});
