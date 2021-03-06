// Karma configuration
// Generated on Thu Jan 15 2015 14:43:37 GMT+0500 (Pakistan Standard Time)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    //basePath: 'cbt-balance-transaction-widget),


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
		// All the libraries & files needed for testing
        // libraries from bower as dependencies
        //'bower_components/angular/angular.min.js',
    ],


    // list of files to exclude
    exclude: [],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        //'cbt-dashboard-balance-transaction-widget/src/balance-transaction/js/**/*.js': ['coverage'],
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'junit', 'coverage'],
    
    // the default configuration
       junitReporter: {
         outputFile: '../target/TEST-results.xml',
         suite: ''
       },
       
    // optionally, configure the reporter
       coverageReporter: {
            dir: 'target/coverage',
            reporters: [
                {
                    type: 'html',
                    subdir: '/'
                },
                {
                    type: 'lcov',
                    subdir: '/'
                }
            ]
        },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
