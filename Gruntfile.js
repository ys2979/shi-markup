module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        express: {
            dev: {
                options: {
                    script: './server.js'
                }
            }
        },
        sass: {
            development: {
                files: {
                    'dist/assets/css/app.css': 'src/assets/css/app.scss'
                }
            },
            production: {
                options: {
                    style: 'compressed'
                },
                files: {
                    'dist/assets/css/app.css': 'src/assets/css/app.scss'
                }
            }
        },
        uglify: {
            development: {
                options: {
                    report: false,
                    mangle: false,
                    beautify: true
                },
                files: {
                    'dist/assets/js/app.js': ['src/assets/js/*.js']
                }
            },
            production:  {
                options: {
                    report: false
                },
                files: {
                    'dist/assets/js/app.js': ['src/assets/js/*.js']
                }
            }
        },
        shell: {
            server: {
                command: 'node server.js'
            },
            open_browser: {
                command: 'open http://localhost:3000'
            }
        },
        watch: {
            livereload: {
                options: {
                    livereload: true
                },
                files: ["dist/**/*"]
            },
            css: {
                files: 'src/**/*.scss',
                tasks: ['sass:development']
            },
            js: {
                files: 'src/**/*.js',
                tasks: ['uglify:development']
            },
            html: {
                files: 'src/*.html',
                tasks: ['copy:html']
            }
        },
        copy: {
            html: {
                cwd: 'src/',  // set working folder / root to copy
                src: '**/*.html',      // copy all files and subfolders **with ending .html**
                dest: 'dist/',    // destination folder
                expand: true           // required when using cwd
            },
            data: {
                files: [{
                    cwd: 'src/assets/data/',
                    src: '**/*',
                    dest: 'dist/assets/data/',
                    expand: true
                }]
            }
        },

        config: grunt.file.readJSON('config.json'),
        env: grunt.file.readJSON('.env'),

        aws_s3: {
          options: {
            accessKeyId: '<%= env.access %>',
            secretAccessKey: '<%= env.secret %>',
            uploadConcurrency: 5,
            downloadConcurrency: 5,
            region: 'us-east-1'
          },
          deploy: {
            options: {
              bucket: '<%= config.bucket %>'
            },
            files: [
              {expand: true, cwd: 'dist/', src: ['**'], dest: ''}
            ]
          }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-aws-s3');

    grunt.registerTask('build', ['copy:html', 'copy:data', 'sass:development', 'uglify:development'])
    grunt.registerTask('default', ['express:dev', 'build', 'shell:open_browser', 'watch']);
    grunt.registerTask('deploy', ['sass:production', 'uglify:production', 'aws_s3']);
};