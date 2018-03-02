import gulp from 'gulp';
import sourceMaps from 'gulp-sourcemaps';
import babel from 'gulp-babel';
import path from 'path';
import sass from 'gulp-sass';
import concat from 'gulp-concat';
import livereload from 'gulp-livereload';
import nodemon from 'gulp-nodemon';
import Cache from 'gulp-file-cache';
import del from 'del';
import ava from 'gulp-ava';
import eslint from 'gulp-eslint';

let cache = new Cache();

const paths = {
    dest: './dist',
    es6: ['./app/**/*.js', '!./app/assets/**/*.js'],
    scss: './app/**/*.scss',
    css: './app/assets/rendered',
    assets: ['./app/assets/**/*', '!./app/assets/scss/**/*'],
    vue: ['./app/**/*.vue'],
    tests: 'test/**/*.js',
    // Must be absolute or relative to source map
    sourceRoot: path.join(__dirname, 'src')
};

gulp.task('sass', function () {
    return gulp.src(paths.scss)
        .pipe(sourceMaps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(concat('style.css'))
        .pipe(sourceMaps.write())
        .pipe(gulp.dest(paths.css))
        .pipe(livereload());
});

gulp.task('watch', ['sass'], function () {
    livereload.listen({
        port: 35732
    });
    nodemon({
        script: 'app/',
        stdout: true,
        watch: 'app',
        ext: 'js scss vue',
        tasks: ['clean', 'babel', 'vue', 'sass'],
    }).on('restart', function onRestart() {
        // reload connected browsers after a slight delay
        setTimeout(function reload() {
            livereload.reload();
        }, 1500);
    });
});

gulp.task('default', [
    'watch'
]);