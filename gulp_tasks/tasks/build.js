var gulp = require('gulp'),
    sequence = require('run-sequence');

gulp.task('build', ['prep-build'], function (cb) {
    sequence(
        // ['images', 'fonts', 'minhtml', 'mincss', 'extras'],
        ['fonts', 'minhtml', 'mincss', 'extras'],
        'webpack:build',
        cb
    );
});
