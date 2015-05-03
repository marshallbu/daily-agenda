var gulp = require('gulp');
var config = require('./../utils/config');

gulp.task('partial-compile', function() {
  return gulp.src(config.src.dir.partials + '*')
    .pipe(gulp.dest(config.dist.dir.partials));
});
