var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    fs = require('fs'),
    config = require('./../utils/config');

gulp.task('partial-compile', function(callback) {

    return gulp.src(config.src.dir.partials + '*')
        // .pipe(plugins.template({
        //     downloadUrl: config.dist.file.resume
        // }))
        .pipe(gulp.dest(config.dist.dir.partials));

});
