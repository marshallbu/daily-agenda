var gulp = require('gulp');
var isProduction = process.env.NODE_ENV === 'production';
var plugins = require('gulp-load-plugins')();
var config = require('./../utils/config');

gulp.task('mincss', ['less'], function() {
  return gulp.src(config.dist.dir.styles + '*.css')
    .pipe(plugins.if(isProduction, plugins.minifyCss()))
    .pipe(gulp.dest(config.dist.dir.styles));
});
