var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    config = require('./../utils/config');

gulp.task('watch', ['build'], function() {
  var report, server;

  server = plugins.livereload(35729);
  report = function(file) {
    return server.changed(file.path);
  };

  gulp.watch(config.src.glob.html, function() {
    return gulp.start('minhtml');
  });

  gulp.watch(config.src.glob.scripts, function() {
    return gulp.start('webpack:build');
  });

  gulp.watch(config.src.glob.vendorScripts, function() {
    return gulp.start('webpack:build');
  });

  gulp.watch(config.src.glob.watchstyles, function() {
    return gulp.start('mincss');
  });

  gulp.watch(config.src.glob.images, function() {
    return gulp.start('images');
  });

  gulp.watch(config.src.glob.extras, function() {
    return gulp.start('extras');
  });

});
