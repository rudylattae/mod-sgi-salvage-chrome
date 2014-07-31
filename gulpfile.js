'use strict';

var gulp = require('gulp'),
  tinylr = require('tiny-lr'),
  jshint = require('gulp-jshint'),
  zip = require('gulp-zip'),
  size = require('gulp-size'),
  git = require('gulp-git'),
  pkg = require('./package.json'),
  man = require('./src/manifest.json');


var paths = {
  pkg: './package.json',
  man: './src/manifest.json',
  src: './src',
  app: './src/app',
  dist: './dist',
  allFiles: '/**/*',
  scriptFiles: '/**/*.js'
};


gulp.task('lint', function() {
  return gulp.src([paths.app + paths.scriptFiles, 'gulpfile.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});


// develop
// ========

gulp.task('dev', function () {
  var lr = tinylr();

  lr.listen(35729);
  gulp.watch(['**.{js,css,html}'], function (evt) {
    lr.changed({
      body: {
        files: [evt.path]
      }
    });
  });
});


// package
// ========
gulp.task('package', ['lint'], function() {
  var distFilename = man.name + '-' + man.version + '.zip';

  return gulp.src([paths.src + paths.allFiles])
    .pipe(zip(distFilename))
    .pipe(size())
    .pipe(gulp.dest(paths.dist));
});


// ship
// =====

gulp.task('tag-release', function () {
  var version = 'v' + pkg.version,
    message = 'Release ' + version;

  return gulp.src('./')
    .pipe(git.commit(message))
    .pipe(git.tag(version, message))
    .pipe(git.push('origin', 'master', '--tags'))
    .pipe(gulp.dest('./'));
});
