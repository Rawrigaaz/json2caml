const pump = require('pump');
const packageJson = require('./package.json');

const gulp = require('gulp');
const mocha = require('gulp-mocha');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const insert = require('gulp-insert');
const rename = require('gulp-rename');
const babel = require('gulp-babel');

gulp.task('transpile', () => gulp.src('src/*.js')
    .pipe(babel({
        presets: ['es2015']
    }))
    .pipe(insert.prepend('/*! json2caml v'+packageJson.version+' */\n'))
    .pipe(gulp.dest('dist'))
);

gulp.task('build', ['transpile'], (cb) => {
    pump([
            gulp.src(['dist/*.js', '!dist/*min.js']),
            uglify(),
            insert.prepend('/*! json2caml v'+packageJson.version+' | (c) Niklas Engblom | MIT License */\n'),
            rename({suffix: '.min'}),
            gulp.dest('dist')
        ],
        cb
    );
});

gulp.task('test', () => gulp.src(['test/test.js'], { read: false })
    .pipe(mocha({ reporter: 'spec' }))
    .on('error', gutil.log)
);