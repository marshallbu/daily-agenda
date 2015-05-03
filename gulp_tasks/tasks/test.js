var gulp = require('gulp');
var args = require('yargs').argv;
var sequence = require('run-sequence');
var config = require('./../utils/config');

gulp.task('test', ['test:unit']);

gulp.task('test:unit', ['clean'], function(cb) {
  return sequence('test:runner', cb);
});

gulp.task('test:runner', function(cb){
  var file = args.file;

  cb();
});
