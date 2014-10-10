var plugins = require('gulp-load-plugins')();

module.exports = {
    info: plugins.util.log.bind(undefined, '[INFO]'),
    warn: plugins.util.log.bind(undefined, plugins.util.colors.yellow('[WARN]')),
    error: plugins.util.log.bind(undefined, plugins.util.colors.red('[ERROR]')),
    debug: plugins.util.log.bind(undefined, plugins.util.colors.cyan('[DEBUG]'))
};
