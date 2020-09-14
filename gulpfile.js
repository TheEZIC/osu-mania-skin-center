const
    gulp = require('gulp'),
    browserify = require('browserify'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync').create(),
    source = require('vinyl-source-stream');

gulp.task('server', () => {
    browserSync.init({
        server: './'
    })

    gulp.watch('./scripts/**/*.js', gulp.parallel(['scripts']));
    gulp.watch('./style/**/*.scss', gulp.parallel(['styles']));
    gulp.watch('./index.html').on('change', () => browserSync.reload());
})

gulp.task('scripts', () => {
    return ( 
        browserify('./scripts/index.js')
        .bundle()
        .pipe(source('./index.js'))
        .pipe(gulp.dest('./'))
        .pipe(browserSync.reload({ stream: true }))
    )
})

gulp.task('styles', () => {
    return gulp.src('./style/index.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./'))
    .pipe(browserSync.reload({ stream: true }))
})

gulp.task('default', gulp.parallel(['server']));