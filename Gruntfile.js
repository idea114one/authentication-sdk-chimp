module.exports = function (grunt) {
    // Load installed grunt tasks on demand to improve performance
    require('jit-grunt')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    grunt.initConfig({
        srcMain: 'src',
        dist: 'dist',
        temp: '.tmp',

        clean: {
            dist: [
                '<%= dist %>'
            ],
            temp: [
                '<%= temp %>'
            ]
        },

        copy: {
            main: {
                expand: true,
                cwd: 'src',
                src: '**',
                dest: '<%= temp %>/',
            },
        },

        portPick: {
            karma: {
                targets: [
                    'karma.options.port'
                ]
            }
        },
        karma: {
            options: {
                port: 0
            },
            continuous: {
                configFile: 'karma.conf.js',
                singleRun: false,
                background: true
            },
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },
        jslint: {
            all: {
                src: 'src/**.js',
                directives: {
                    node: true,
                    todo: true,
                    globals: {
                        "describe": false,
                        "xdescribe": false,
                        "ddescribe": false,
                        "it": false,
                        "xit": false,
                        "iit": false,
                        "beforeEach": false,
                        "afterEach": false,
                        "expect": false,
                        "pending": false,
                        "spyOn": false,
                        "angular": false,
                        "jasmine": true,
                        "define": true,
                        "inject": true,
                        "window": true
                    },
                    sloppy: false,
                    plusplus: true,
                    maxlen: 140
                },
                options: {
                    failOnError: true
                }
            }
        },

        // ng-annotate tries to make the code safe for minification automatically
        // by using the Angular long form for dependency injection.
        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            app: {
                files: {
                    '<%= temp%>/authentication.js': ['<%= temp%>/authentication.js']
                }
            }
        },
        uglify: {
            js: { //target
                src: ['<%= temp%>/authentication.js'],
                dest: 'dist/authentication.js'
            }
        }
    });

    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-port-pick');

    grunt.registerTask('build', [
        'clean:dist',
        'jslint:all',
        'copy:main',
        //'portPick',
        'ngAnnotate',
        'uglify',
        'clean:temp'

        //'concat',
        //'ngAnnotate'
    ]);

    grunt.registerTask('test', ['karma:unit']);
};