var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var config = require('./../utils/config');

gulp.task('compile-html', ['process-html'], function() {
  return gulp.src(config.distRoot + 'index.html')
    .pipe(plugins.fileInclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(config.distRoot));
});
