var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    config = require('./../utils/config');

gulp.task('lint', function () {
    return gulp.src(config.src.glob.scriptsToLint)
        .pipe(plugins.eslint())
        .pipe(plugins.eslint.format());
        // .pipe(plugins.eslint.failAfterError());
});
