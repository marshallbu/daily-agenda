var gulp = require('gulp'),
    isProduction = process.env.NODE_ENV === 'production',
    plugins = require('gulp-load-plugins')(),
    config = require('./../utils/config');

gulp.task('build:watch', ['clean'], function () {
    // TODO: make a watch task for individual file sets
});
