var gulp = require('gulp');

var connect = require('gulp-connect');
var less = require('gulp-less');
var minifyCSS = require('gulp-minify-css');
var gzip = require('gulp-gzip');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var babelify = require('babelify');

function swallowError(error) {
  console.log(error.toString());
  console.error("\u0007"); // terminal bell/beep code
  this.emit('end');
}

var paths = {
  less: 'src/less/**/*.less',
  js: [ 'src/js/**/*.js', 'src/js/**/*.jsx' ]
};

gulp.task('js', ['build-sender', 'build-receiver']);

gulp.task('build-sender', function() {
  return browserify({
    entries: './src/js/sender.js',
    paths: [ './node_modules', './src/js/sender' ],
    transform: [babelify]
  })
  .bundle()
  .on('error', swallowError)
  .pipe(source('./public/js/sender.js'))
  .pipe(gulp.dest('./'));
});

gulp.task('build-receiver', function() {
  return browserify({
    entries: './src/js/receiver.js',
    paths: [ './node_modules', './src/js/receiver' ],
    transform: [babelify]
  })
  .bundle()
  .on('error', swallowError)
  .pipe(source('./public/js/receiver.js'))
  .pipe(gulp.dest('./'));
});

gulp.task('less', function() {
  return gulp.src(paths.less)
  .pipe(less())
  .on('error', swallowError)
  .pipe(minifyCSS())
  .pipe(gulp.dest('public/css'));
});

gulp.task('compress', ['less', 'js'], function() {
  gulp.src([ './public/**/*.js', './public/**/*.css', './public/**/*.html'])
    .pipe(gzip({ gzipOptions: { level: 9 }}))
    .pipe(gulp.dest('./public'));
});

gulp.task('connect', function() {
  connect.server({
    root: 'public/',
    port: 1337
  });
});

gulp.task('watch', function() {
  gulp.watch(paths.less, ['less']);
  gulp.watch(paths.js, ['js']);
});

gulp.task('build', ['less', 'js', 'compress']);
gulp.task('default', ['build', 'connect', 'watch']);
