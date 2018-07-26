const minify = require('gulp-minify');


var gulp = require('gulp');
gulp.task('default',function(){
	console.log("Hello in first gulp");
});

gulp.task('compress', function() {
  gulp.src(['js/*.js'])
    .pipe(minify())
    .pipe(gulp.dest('dist'))
});



var cssmin = require('gulp-cssmin');
var rename = require('gulp-rename');
 
gulp.task('cssminify', function () {
    gulp.src('css/**/*.css')
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});


var uglifyjs = require('uglify-js'); // can be a git checkout
                                     // or another module (such as `uglify-es` for ES6 support)
var composer = require('gulp-uglify/composer');
var pump = require('pump');
 
var minify1 = composer(uglifyjs, console);
 
gulp.task('compressuglify', function (cb) {
  // the same options as described above
  var options = {};
 
  pump([
      gulp.src('js/*.js'),
      minify(options),
      gulp.dest('dist')
    ],
    cb
  );
});