module.exports = function( grunt ) {
    'use strict';
    // load plugins
    require( 'load-grunt-tasks' )( grunt );

    var banner = '/**\n    @name: <%= pkg.name %> \n    @version: <%= pkg.version %> (<%= grunt.template.today("dd-mm-yyyy") %>) \n    @author: <%= pkg.author.name %> \n    @url: <%= pkg.homepage %> \n    @license: <%= pkg.license %>\n*/\n';

    var autoprefixer = require( 'autoprefixer' )( {
        browsers: [
            'Chrome >= 35', // Exact version number here is kinda arbitrary
            'Firefox >= 31', // Current Firefox Extended Support Release (ESR)
            'iOS >= 8',
            'Safari >= 8',
            'Android >= 4'
        ]
    } );
    var libs = [
        'node_modules/lodash/dist/lodash.js',
        'node_modules/angular/angular.js',
        'node_modules/angular-animate/angular-animate.js',
        'node_modules/angular-aria/angular-aria.js',
        'node_modules/angular-material/angular-material.js',
        'node_modules/angular-material-data-table/dist/md-data-table.js',
        'node_modules/angular-ui-router/release/angular-ui-router.js',
        'node_modules/angular-filter/dist/angular-filter.js'
    ]

    var app = [
        'src/public/app/app.js',
        'src/public/app/app.config.js',
        'src/public/app/app.run.js',
        'src/public/app/directives/google-login.js',
        'src/public/app/directives/spinner.js',
        'src/public/app/services/pricebook.js',
        'src/public/app/services/lodash-factory.js',
        'src/public/app/services/local-storage.js',
        'src/public/app/controllers/dimensions.js',
        'src/public/app/controllers/specs.js'
    ]
    grunt.initConfig( {
        pkg: grunt.file.readJSON( 'package.json' ),
        watch: {
            scripts: {
                files: [ 'src/public/app/**/*.js' ],
                tasks: [ 'concat' , 'uglify', 'cssmin', 'htmlmin', 'postcss'] //
            }
        },
        postcss: {
            options: {
                map: false,
                processors: autoprefixer,
            },
            style: {
                src: 'src/public/css/*.css'
            }
        },
        concat: {
            options: {
                stripBanners: false,
                separator: ';',
                banner: banner
            },
            libs: {
                src: libs,
                dest: 'src/public/js/libs.js'
            },
            app: {
                src: app,
                dest: 'src/public/js/app.js'
            }
        },
        cssmin: {
            options: {
                map: false,
                keepSpecialComments: '*'
            },
            style: {
                expand: true,
                cwd:'src/public/css/',
                src: [ '*.css', '!*.min.css' ],
                dest:  'dist/public/css/',
                ext: '.css'
            }
        },
        uglify: {
            options: {
                mangle: false,
                preserveComments:false
           },
            libs: {
                files: {
                     'dist/public/js/libs.js' : ['src/public/js/libs.js']
                }
            },
            app: {
                files: {
                    'dist/public/js/app.js': ['src/public/js/app.js']
                }
            }
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {
                    'dist/public/index.html': 'src/public/index.html',
                    'dist/public/views/dimensions.html': 'src/public/views/dimensions.html',
                    'dist/public/views/login.html': 'src/public/views/login.html',
                    'dist/public/views/navbar.html': 'src/public/views/navbar.html',
                    'dist/public/views/sidebar.html': 'src/public/views/sidebar.html',
                    'dist/public/views/specs.html' : 'src/public/views/specs.html'
                }
            }
        }
    } );
    grunt.registerTask( 'default', [
        'concat',
        'postcss',
        'cssmin',
        'uglify',
        'htmlmin',
        'watch'
    ] );
};
