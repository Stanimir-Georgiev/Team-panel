const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const rename = require("gulp-rename");
const gulpBabel = require("gulp-babel");
const sassLint = require('gulp-sass-lint');
const concat = require('gulp-concat')
const minify = require('gulp-minify');
const imagemin = require('gulp-imagemin');

gulp.task('sass', function(){
    return gulp.src('./src/sass/master.scss')
    .pipe(sourcemaps.init())
    .pipe(sassLint())
	.pipe(sassLint.format())
	.pipe(sassLint.failOnError())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css/'))
});

gulp.task('cssmin', function(){
    return gulp.src('./dist/css/master.css')
    .pipe(sourcemaps.init())
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./dist/css'))
});
gulp.task('scriptsmin', function(){
    return gulp.src([
       './src/scripts/vendor/*.js',
       './src/scripts/scripts.js'
    ])
    .pipe(gulpBabel({
        presets: ['@babel/env']
    }))
    .pipe(concat("bundle.js"))
	.pipe(minify())
    .pipe(gulp.dest('./dist/scripts'))
})

gulp.task('watch', function(){
    gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('dist/css/master.css', gulp.series('cssmin'));
    gulp.watch('src/scripts/scripts.js', gulp.series('scriptsmin'));
});

gulp.task("default", 
	gulp.series("sass",
		gulp.parallel("scriptsmin",
			"cssmin",),
		"watch"
	)
);