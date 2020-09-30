const projectFolder = 'docs/';
const sourceFolder = 'src/';

const path = {
	build: {
		html: projectFolder,
		css: projectFolder + 'css/',
		js: projectFolder + 'js/',
		img: projectFolder + 'img/',
		fonts: projectFolder + 'fonts/'
	},
	src: {
		html: [sourceFolder + '*.html', '!' + sourceFolder + '_*.html'],
		css: sourceFolder + 'scss/*.scss',
		js: sourceFolder + 'js/script.js',
		img: sourceFolder + 'img/**/*.*',
		fonts: sourceFolder + 'fonts/*.ttf'
	},
	watch: {
		html: sourceFolder + '**/*.html',
		css: sourceFolder + 'scss/**/*.scss',
		js: sourceFolder + 'js/**/*.js',
		img: sourceFolder + 'img/**/*.*'
	},
	clean: './' + projectFolder
};

const { src, dest } = require('gulp');
const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const fileInclude = require('gulp-file-include');
const scss = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify-es').default;
const ttf2woff = require('gulp-ttf2woff');
const ttf2woff2 = require('gulp-ttf2woff2');
const fonter = require('gulp-fonter');
const svgSprite = require('gulp-svg-sprite');
const fs = require('fs');
const sourcemap = require('gulp-sourcemaps');

function html(cb) {
	src(path.src.html)
		.pipe(fileInclude())
		.pipe(dest(path.build.html))
		.pipe(browserSync.stream());
	return cb();
}

function css(cb) {
	src(path.src.css)
		.pipe(sourcemap.init())
		.pipe(
			scss({
				outputStyle: 'expanded'
			}).on('error', scss.logError)
		)
		.pipe(gcmq())
		.pipe(
			autoprefixer(['last 5 version'], {
				cascade: true
			})
		)
		.pipe(dest(path.build.css))
		.pipe(cleanCSS())
		.pipe(
			rename({
				extname: '.min.css'
			})
		)
		.pipe(sourcemap.write('.'))
		.pipe(dest(path.build.css))
		.pipe(browserSync.stream());
	return cb();
}

function js(cb) {
	src(path.src.js)
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: '.min.js'
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream());
	return cb();
}

function images(cb) {
	src(path.src.img)
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(src(sourceFolder + 'icon/favicon/**'))
		.pipe(dest(projectFolder + 'icon/favicon/'));
	return cb();
}

function otf2ttf(cb) {
	src([sourceFolder + 'fonts/*.otf'])
		.pipe(
			fonter({
				formats: ['ttf']
			})
		)
		.pipe(dest(sourceFolder + 'fonts/'));
	return cb();
}

function fonts(cb) {
	src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
	src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
	return cb();
}

function putFonts(cb) {
	return fs.readdir(path.build.fonts, function (err, items) {
		if (items) {
			for (const item of items) {
				const fontName = item.split('.')[0];
				const isWoff = item.split('.')[1] === 'woff';
				if (isWoff) {
					fs.appendFileSync(
						sourceFolder + 'scss/_fonts.scss',
						'@include font("' + fontName + '", "' + fontName + '", "400", "normal");\r\n'
					);
				}
			}
		}
		cb();
	});
}

function svg2Sprite(cb) {
	gulp
		.src(sourceFolder + 'icon/iconsSprite/*.svg')
		.pipe(
			svgSprite({
				mode: {
					stack: {
						sprite: '../icons/icons.svg'
					}
				},
				shape: {
					dimension: {
						attributes: true
					}
				}
			})
		)
		.pipe(dest(path.build.img));
	return cb();
}

function watchFiles() {
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.css, css);
	gulp.watch(path.watch.js, js);
}

function browserSyncFunc() {
	browserSync.init({
		server: {
			baseDir: './' + projectFolder
		},
		port: 3000,
		notify: false,
		open: false
	});

	watchFiles();
}

gulp.task('js', js);
gulp.task('css', css);
gulp.task('html', html);
gulp.task('images', images);
gulp.task('otf2ttf', otf2ttf);
gulp.task('fonts', fonts);
gulp.task('putFonts', putFonts);
gulp.task('svg2Sprite', svg2Sprite);

const start = gulp.series(gulp.parallel(images, svg2Sprite, otf2ttf), fonts, putFonts);
gulp.task('start', start);

const watch = gulp.series(gulp.parallel(js, css, html), browserSyncFunc);
gulp.task('watch', watch);

gulp.task('default', watch);
