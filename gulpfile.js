const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const terser = require('gulp-terser');
const browsersync = require('browser-sync').create();

// SASS
function scssTask() {
        return src('app/scss/style.scss', { sourcemaps: true })
                .pipe(sass())
                .pipe(postcss([cssnano()]))
                .pipe(dest('dist', { sourcemaps: '.' }));
}

// JAVASCRIPT
function jsTask() {
        return src('app/js/script.js', { sourcemaps: true })
                .pipe(terser())
                .pipe(dest('dist', { sourcemaps: '.' }));
}

// BROWSERSYNC
function browsersyncServe(cb) {
        browsersync.init({
                server: {
                        baseDir: '.'
                }
        });
        cb();
}

function browsersyncReload(cb) {
        browsersync.reload();
        cb();
}

// WATCH
function watchTask() {
        watch('*.html', browsersyncReload);
        watch(['app/scss/**/*.scss', 'app/js/**/*.js'], series(scssTask, jsTask, browsersyncReload));
}

// GULP DEFAULT
exports.default = series(
        scssTask,
        jsTask,
        browsersyncServe,
        watchTask
);