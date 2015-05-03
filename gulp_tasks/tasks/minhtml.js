var gulp = require('gulp');
var isProduction = process.env.NODE_ENV === 'production';
var plugins = require('gulp-load-plugins')();
var config = require('./../utils/config');

gulp.task('minhtml', ['compile-html'], function() {
  var opts = {
    // cdata: true,
    // comments: true,
    // conditionals: true,
    // spare: true
  };

  return gulp.src(config.distRoot + '*.html')
    .pipe(plugins.if(isProduction, plugins.minifyHtml(opts)))
    .pipe(gulp.dest(config.distRoot));
});
