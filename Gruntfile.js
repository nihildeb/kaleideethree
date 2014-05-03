'use strict';

module.exports = function(grunt){
  grunt.initConfig({
    copy: {
      build: {
        cwd: 'src',
        src: ['**', '!**/*.less'],
        dest: 'build',
        expand: true
      },
      deploy: {
        src: ['dist/index.html'],
        dest: './index.html'
      }
    },
    clean: {
      build: {
        src: [ 'build' ]
      },
      dist: {
        src: ['dist/**/*debug*']
      }
    },
    autoprefixer: {
      options: {
          browsers: ['last 2 version', 'ie 8', 'ie 9'],
          cascade: true
      },
      build: {
        src: 'build/css/index.css',
        dest: 'build/css/index.css'
      },
      logo: {
        src: 'build/css/logo.css',
        dest: 'build/css/logo.css'
      }
    },
    uglify: {
      minify: {
        options: { mangle: true },
        files: {
          'build/js/logo.min.js': ['build/js/logo.js'],
          'build/js/index.min.js': ['build/js/index.js'],
        }
      }
    },
    jade: {
      debug: {
        options: {
          pretty: true,
          data: {
            'dotmin': '',
            'mirrorCount': '8'
          }
        },
        files: [{
          expand: true,
          cwd: 'build',
          src: [ '**/*.jade', '!**/layout*' ],
          dest: 'build',
          ext: '.debug.html'
        }]
      },
      desktop: {
        options: {
          pretty: false,
          data: {
            'dotmin': '',
            'mirrorCount': '32'
          }
        },
        files: [{
          expand: true,
          cwd: 'build',
          src: [ '**/*.jade', '!**/layout*' ],
          dest: 'build',
          ext: '.32.html'
        }]
      },

      production: {
        options: {
          pretty: false,
          data: {
            'dotmin': '.min',
            'mirrorCount': '8'
          }
        },
        files: [{
          expand: true,
          cwd: 'build',
          src: [ '**/*.jade', '!**/layout*' ],
          dest: 'build',
          ext: '.html'
        }]
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: 'build/css/',
        src: ['*.css', '!*.min.css'],
        dest: 'build/css/',
        ext: '.min.css'
      }
    },
    inline: {
      dist: {
        src: ['build/*.html'],
        dest: ['dist/']
      }
    },
    watch: {
      html: {
        options: { livereload: true },
        files: ['dist/**/*.html']
      },
      all: {
        files: ['src/**/*', 'Gruntfile.js'],
        tasks: ['dist']
      }
    },
    connect: {
      server: {
        options: {
          base: './'
        }
      }
    },
    less: {
      production: {
        options: {
          paths: [],
          cleancss: true,
          modifyVars: {
            //imgPath: 'http://mycdn.com/path/to/images',
            bgColor: 'red'
          }
        },
        files: [{
          expand: true,
          cwd: 'src/css',
          src: ['*.less'],
          dest: 'build/css/',
          ext: '.css'
        }]
      }
    },
    jshint: {
      options: {
        node: true,
        curly: false,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          d3: true,
          _: true
        },
      },
      all: ['Gruntfile.js', 'src/js/**/*.js', '!src/js/**/*.min.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-inline');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-less');

  grunt.registerTask('build-init', ['clean', 'copy:build']);
  grunt.registerTask('styles', ['less', 'autoprefixer', 'cssmin']);
  grunt.registerTask('scripts', ['jshint', 'uglify']);
  grunt.registerTask('build', ['build-init','styles','scripts','jade']);
  grunt.registerTask('dist', ['build', 'inline', 'copy:deploy']);
  grunt.registerTask('default', ['dist']);
  grunt.registerTask('dev', ['dist', 'connect', 'watch']);
};
