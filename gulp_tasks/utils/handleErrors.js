var plugins = require('gulp-load-plugins')();

module.exports = function() {

  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  plugins.notify.onError({
    title: "Compile Error",
    message: "<%= error.message %>"
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};
