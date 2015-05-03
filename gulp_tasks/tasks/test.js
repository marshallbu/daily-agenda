var gulp = require('gulp'),
    args = require('yargs').argv,
    sequence = require('run-sequence'),
    config = require('./../utils/config');

gulp.task('test', ['test:unit']);

gulp.task('test:unit', ['clean'], function(cb) {
    return sequence('test:runner', cb);
});

gulp.task('test:runner', function(cb){
    var file = args.file;

    cb();
});
