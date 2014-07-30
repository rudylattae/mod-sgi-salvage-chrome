'use strict';

var gulp = require('gulp'),
  tinylr = require('tiny-lr'),
  jshint = require('gulp-jshint'),
  zip = require('gulp-zip'),
  size = require('gulp-size');


var paths = {
  pkg: './package.json',
  manifest: './src/manifest',
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

gulp.task('package', ['lint'], function() {
  var manifest = require(paths.manifest),
    packageArchiveName = manifest.name + '-' + manifest.version + '.zip';

  return gulp.src([paths.src + paths.allFiles])
    .pipe(zip(packageArchiveName))
    .pipe(size())
    .pipe(gulp.dest(paths.dist));
});

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