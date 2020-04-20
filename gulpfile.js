const gulp = require('gulp');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const gulpif = require('gulp-if');

const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;


gulp.task('clean', function() {
  return del('build/*')
})

gulp.task('css', function () {
  return gulp.src ('./src/css/**/*.css')
    .pipe(gulpif(isDev, sourcemaps.init()))
    .pipe(postcss( [ autoprefixer({ cascade: false }) ] ))
    .pipe(gulpif(isProd, cleanCSS({level: 1})))
    .pipe(concat('all.css'))
    .pipe(gulpif(isDev, sourcemaps.write()))
    .pipe(gulp.dest('./build/css'))
    .pipe(browserSync.stream())
});

gulp.task('html', function() {
  return gulp.src ('./src/**/*.html')
    .pipe (gulp.dest ('./build'))
    .pipe(browserSync.stream())
})

gulp.task('browser-sync', function() {
  browserSync.init({
      server: {
          baseDir: "./build/"
      }
  });
  gulp.watch('./src/css/**/*.css', gulp.parallel('css'))
	gulp.watch('./src/**/*.html', gulp.parallel('html'))
});

gulp.task('build', gulp.series('clean', gulp.parallel('css', 'html')));
gulp.task('watch', gulp.series('build', gulp.parallel('browser-sync'))); 
