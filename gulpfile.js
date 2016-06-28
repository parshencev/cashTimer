var gulp            = require('gulp'),
    htmlmin         = require('gulp-htmlmin'),
    browserSync     = require('browser-sync').create(),
    uglify          = require('gulp-uglify'),
    less            = require('gulp-less'),
    LessAutoprefix  = require('less-plugin-autoprefix'),
    autoprefix      = new LessAutoprefix({ browsers: ['last 2 versions'] });
    path        = {
      js : "./src/js/*.js",
      less : "./src/less/*.less",
      html : "./src/*.html",
      js_min : "./build/js/",
      css : "./build/css/",
      html_min : "./build/",
      server : "./build/",
      watch_build : "./build/**/*"
    };

gulp.task('less', function () {
  return gulp.src(path.less)
  .pipe(less({
    plugins: [autoprefix]
  }))
  .pipe(gulp.dest(path.css));
});

gulp.task('js', function () {
 return gulp.src(path.js)
  .pipe(uglify())
  .pipe(gulp.dest(path.js_min));
});

gulp.task('html', function() {
  return gulp.src(path.html)
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest(path.html_min))
});

gulp.task('serve', function() {
    browserSync.init({
        server: path.server
    });

    gulp.watch(path.watch_build).on('change', browserSync.reload);
});

gulp.task('watch', function () {
  gulp.watch(path.js, ['js']);
  gulp.watch(path.less, ['less']);
  gulp.watch(path.html, ['html']);
});

gulp.task('default',['js','less','html','watch'], function() {
  gulp.run(['serve']);
});
