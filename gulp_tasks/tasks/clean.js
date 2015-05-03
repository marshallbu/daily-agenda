var gulp = require('gulp'),
    del = require('del'),
    config = require('./../utils/config');

gulp.task('clean', function (cb) {
  del([config.distRoot], cb);
});
