var pump = require('pump');

var gulp = require('gulp');
var mocha = require('gulp-mocha');
var gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var insert = require('gulp-insert');

gulp.task('build', function(cb) {
    pump([
            gulp.src('src/*.js'),
            uglify(),
            insert.prepend('/*! json2caml v1.0.0 | (c) Niklas Engblom | MIT License */\n'),
            gulp.dest('dist')
        ],
        cb
    );
});

gulp.task('test', function() {
    return gulp.src(['test/test.js'], { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .on('error', gutil.log);
});