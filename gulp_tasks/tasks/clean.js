var gulp = require('gulp');
var del = require('del');
var config = require('./../utils/config');

gulp.task('clean', function (cb) {
  del([config.distRoot], cb);
});
