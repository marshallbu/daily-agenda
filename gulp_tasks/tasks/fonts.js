var gulp = require('gulp'),
    config = require('./../utils/config');

gulp.task('fonts', function() {
    gulp.src(config.src.glob.fonts)
        .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('fonts:watch', ['fonts'], function() {
    gulp.watch('./app/fonts/**/*.woff', ['fonts']);
});
