var gulp = require('gulp');
var sequence = require('run-sequence');

gulp.task('build', ['prep-build'], function (cb) {
  sequence(
    ['fonts', 'minhtml', 'mincss', 'extras'],
    'webpack:build',
    cb
  );
});
