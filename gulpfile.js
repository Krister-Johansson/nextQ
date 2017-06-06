'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglifyjs');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var util = require('gulp-util');

var config = {
    production: !!util.env.production
};

gulp.task('fonts', function () {
    return gulp
        .src('./bower_components/bootstrap-sass/assets/fonts/**/*')
        .pipe(gulp.dest('./public/fonts'));
});

gulp.task('scripts', function() {
  return gulp.src(['./bower_components/bootstrap-sass/assets/javascripts/bootstrap.js', './bower_components/jquery/dist/jquery.js', './public/javascript/app.js'])
    .pipe(concat('bower.js'))
    .pipe(config.production ? uglify() : util.noop())
    .pipe(gulp.dest('./public/javascript'));
});

gulp.task('styles', function() {
  gulp.src('./scss/style.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(config.production ? minifyCss({compatibility: 'ie9'}) : util.noop())
    .pipe(gulp.dest('./public/css'));
});

// Watch task
gulp.task('default',function() {
  // run task initially, after that watch
  gulp.start('styles','fonts','scripts');
  gulp.watch('./scss/*.scss',['styles']);
  gulp.watch('./public/javascript/app.js',['scripts']);
});

gulp.task('build',function() {
  gulp.start('styles','fonts','scripts');
});