var gulp = require('gulp');
var config = require('./../utils/config');

gulp.task('fonts', function() {
  gulp.src(config.src.glob.fonts)
    .pipe(gulp.dest('./dist/fonts/'));
});
