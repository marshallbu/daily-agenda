var gulp = require('gulp');
var path = require('path');
var plugins = require('gulp-load-plugins')();
var config = require('./../utils/config');

gulp.task('less', function () {
  return gulp.src(config.src.glob.styles)
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.less({
      paths: [ path.join(__dirname) ]
    }))
    .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest(config.dist.dir.styles));
});
