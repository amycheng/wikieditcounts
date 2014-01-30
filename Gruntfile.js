/*global module:false*/



module.exports = function(grunt) {
  var
  dev="dev/",
  target='app/';

  grunt.initConfig({
        forever: { //using this to run our node app
          options: {
            index: 'app/app.js'
          }
        },
        jasmine_node: {
          projectRoot: "./test",
          requirejs: true,
          forceExit: true,
        },
        concat: {
          js: {
            src: [
            'dev/jquery.min.js',
            'dev/flowtype.js',
            'dev/main.js'
            ],
            dest: 'app/main.js',
          }
        },
        connect: {
          server: {
            options: {
              port: 9001,
              base: target
            }
          }
        },
        watch: {
          options: {
            livereload: true,
            nospawn: false
          },
          css: {
            files: [dev+'*.scss'],
            tasks: ['sass:dev']
          },
          js: {
            files: [dev+'*.js'],
            tasks: ['concat']
          },
          node: {
            files: ['app/app.js'],
            tasks: ['forever:restart']
          }
        },
        sass: { //our CSS preprocessor
          dev: {
            options: {
              style: 'expanded',
              noCache: false,
              lineNumbers: false,
              compass: false
            },
            files: {
              'app/style.css': [
              dev+'/style.scss'
              ]
            }
          }
        }

      });
grunt.loadNpmTasks('grunt-forever');
grunt.loadNpmTasks('grunt-contrib-sass');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-jasmine-node');
grunt.loadNpmTasks('grunt-contrib-connect');
grunt.loadNpmTasks('grunt-contrib-concat');
grunt.registerTask('test', ['jasmine_node']);
grunt.registerTask('node',['forever:start','watch:node']);
grunt.registerTask('static',['connect','watch']);
grunt.registerTask('js',['watch:js']);
};