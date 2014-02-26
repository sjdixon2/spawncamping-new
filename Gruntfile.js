module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        mochacov: {
            default: {
                src: ['test/index.js'],
                options: {
                    reporter: 'spec'
                }
            },
            jenkins: {
                src: ['test/index.js'],
                options: {
                    reporter: 'xunit',
                    output: 'build/test-result.xml'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-cov');

    //Grunt task for running mocha tests in jenkins
    grunt.registerTask('jenkins', ['mochacov']);
};