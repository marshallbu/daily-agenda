var gulp = require('gulp'),
    plugins = require('gulp-load-plugins')(),
    karma = require('karma').server,
    args = require('yargs').argv,
    sequence = require('run-sequence'),
    webpackConfig = require('../../webpack.config'),
    config = require('./../utils/config');

gulp.task('test', ['test:unit']);

gulp.task('test:unit', ['clean'], function(cb) {
    return sequence('test:runner', cb);
});

gulp.task('test:runner', function(done){
    var file, files;
    file =  args.file;
    files = (file) ? [file] : config.test.glob.karmaUnit;

    karma.start({
        configFile: __dirname + '/../../karma.conf.js',
        singleRun: true,
        reporters: ['mocha', 'coverage'],
        coverageReporter: {
            reporters: [
                {
                    type: 'html',
                    dir: 'test/coverage/'
                },
                {
                    type: 'text-summary',
                    dir: 'test'
                }
            ]
        },
        files: files,
        preprocessors: {
            './test/unit_spec/**/*_spec.js': [ 'webpack' ]
        },
    });

});
