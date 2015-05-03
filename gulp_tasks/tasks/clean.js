var gulp = require('gulp'),
    del = require('del'),
    config = require('./../utils/config');

gulp.task('clean', function (callback) {
  del([config.distRoot], callback);
});
