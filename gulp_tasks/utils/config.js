// Paths relative to 'gulpfile.js'
var sourceRootDir = './app/';
var distRootDir = './dist/';

module.exports = {
    sourceRoot: sourceRootDir,
    src: {
        dir: {
            scripts: './app/scripts/',
            styles: './app/styles/',
            partials: './app/partials/'
        },
        glob: {
            scripts: [
                './app/scripts/**/*.js',
            ],
            scriptsToLint: [
                './app/scripts/**/*.js',
                '!./app/scripts/libs/**',
                '!./app/scripts/workers/**'
            ],
            styles: [
                './app/styles/less/main.less'
            ],
            images: [
              './app/images/**/*.{png,jpg,gif,svg}'
            ],
            fonts: [
              './app/fonts/**/*.{eot,svg,ttf,woff}'
            ],
            html: ['./app/*.html', './app/*.php'],
            partials: ['./app/partials/**/*.html'],
            extras: ['./app/*.*', '!app/*.html'],
        },
        file: {
            app: './app/scripts/main.js',
            lib: './app/scripts/libs/libs.js',
            testConfig: './../../../test/config/karma.conf.js',
            text: [
                './app/.htaccess',
                './app/favicon.ico',
                './app/robots.txt',
                './app/humans.txt'
            ],
        }
    },
    vendorRoot: './bower_modules/',
    distRoot: distRootDir,
    dist: {
        dir: {
            root: distRootDir,
            styles: distRootDir + 'mincss/',
            scripts: distRootDir + 'minjs/',
            partials: distRootDir + 'partials/',
        },
        file: {
            app: 'app.min.js',
            bundle: '[name].min.js'
        }
    },
    test: {
        dir: {
            src: './test/',
            unit: './test/unit_spec/',
        },
        glob: {
            unit: ['./test/unit_spec/**/*.js']
        }
    }
};
