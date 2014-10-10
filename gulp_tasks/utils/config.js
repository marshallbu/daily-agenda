// Paths relative to 'gulpfile.js'
var sourceRootDir = './app/';
var distRootDir = './dist/';

module.exports = {
    sourceRoot: sourceRootDir,
    src: {
        dir: {
            scripts: './app/scripts/',
            styles: './app/styles/',
            // fonts: './app/fonts/',
            // config: './config/',
            // images: './app/images/',
            partials: './app/partials/',
            // downloads: './app/downloads/'
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
            workers: [
                './app/scripts/workers/**'
            ],
            styles: [
                './app/styles/less/main.less',
                // '!./app/styles/**/*.less'
            ],
            images: [
                './app/images/**/*'
            ],
            fonts: [
                './app/fonts/**/*.{eot,svg,ttf,woff}',
                './bower_modules/font-awesome/fonts/*.{eot,svg,ttf,woff}'
            ],
            json: ['./app/json/**/*.json'],
            html: ['./app/*.html', './app/*.php'],
            partials: ['./app/partials/**/*.html'],
            sprite: './app/images/sprite/*.{png,jpg}',
            extras: ['./app/*.*', '!app/*.html'],
            downloads: ['./app/downloads/*.*'],
            projectJSON: ['./*.json']
        },
        file: {
            app: './app/scripts/main.js',
            lib: './app/scripts/libs/libs.js',
            testConfig: './test/config/karma.config.js',
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
            // font: distRootDir + 'fonts/',
            scripts: distRootDir + 'minjs/',
            // workers: distRootDir + 'minjs/workers/',
            // config: distRootDir + 'config/',
            // images: distRootDir + 'images/',
            partials: distRootDir + 'partials/',
        },
        file: {
            app: 'app.min.js',
            libs: 'libs.min.js',
            bundle: '[name].min.js'
        }
    },
    deployArtifacts: './deploy_artifacts/',

    test: {
        unitTestSetup: './test/unitSpec/unitTestSetup.js',
        dir: {
            src: './test/',
            unit: './test/unitSpec/',
            component: './test/componentSpec/',
            integration: './test/integrationSpec/'
        },
        glob: {
            unit: ['./test/unitSpec/**/*.js'],
            karmaUnit: ['../unitSpec/**/*.js'],
            component: ['./test/componentSpec/**/*.js'],
            integration: ['./test/integrationSpec/**/*.js']
        }
    }
};
