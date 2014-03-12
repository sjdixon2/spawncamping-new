//Hack method of loading test environment when tests are run - otherwise dev configurations are loaded
if(process.argv[2] == 'test') {
    process.env.NODE_ENV = 'test'; //Force environment to test mode
}

//Load system config
require('./config');

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: {
                src: ['gruntfile.js', 'app.js', 'core/**/*.js', 'routes/**/*.js'],
                options: {
                    jshintrc: true
                }
            }
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                timeout: 15000
            },
            src: ['./test/']
        },
        sequelize: {
            options: extend(settings.db, {
                migrationsPath: system.pathTo('/migrations')
            })
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        nodemon: {
            dev: {
                script: 'app.js',
                options: {
                    args: [],
                    ignore: ['public/**'],
                    ext: 'js',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    cwd: __dirname
                }
            }
        },

        watch: {
            js: {
                files: ['gruntfile.js', 'app.js', 'core/**/*.js', 'routes/**/*.js', 'public/javascripts/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            views: {
                files: ['core/views/**/*.jade'],
                options: {
                    livereload: true
                }
            },
            images: {
                files: ['public/images/**'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['public/stylesheets/**'],
                options: {
                    livereload: true
                }
            }
        }
    });

    //Load NPM tasks
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-nodemon');
    grunt.loadNpmTasks('grunt-env');
    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-sequelize');

    //Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    //Migration task
    grunt.registerTask('migrate', ['sequelize:migrate']);

    //Default task(s).
    grunt.registerTask('default', ['jshint', 'migrate', 'concurrent']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'jshint', 'migrate', 'mochaTest']);
};