'use strict';

var gulp = require('gulp'),
  tinylr = require('tiny-lr'),
  jshint = require('gulp-jshint'),
  zip = require('gulp-zip'),
  size = require('gulp-size'),
  bump = require('gulp-bump'),
  git = require('gulp-git');


var paths = {
  pkg: './package.json',
  manifest: './src/manifest.json',
  src: './src',
  dist: './dist',
  allFiles: '/*',
  scriptFiles: '/**/*.js'
};


gulp.task('lint', function() {
  return gulp.src([paths.src + paths.scriptFiles, 'gulpfile.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('bump-version', function() {
  return gulp.src([paths.pkg, paths.manifest])
    .pipe(bump())
    .pipe(gulp.dest('./'));
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
  var manifest = require(paths.manifest),
    packageArchiveName = manifest.name + '-' + manifest.version + '.zip';

  return gulp.src([paths.src + paths.allFiles])
    .pipe(zip(packageArchiveName))
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
