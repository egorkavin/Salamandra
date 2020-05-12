let projectFolder = 'docs/';
let sourceFolder = 'src/';

let path = {
	build: {
		html: projectFolder,
		css: projectFolder + 'css/',
		js: projectFolder + 'js/',
		img: projectFolder + 'img/',
		fonts: projectFolder + 'fonts/'
	},
	src: {
		html: [ sourceFolder + '*.html', '!' + sourceFolder + '_*.html' ],
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

let { src, dest } = require('gulp');
let gulp = require('gulp');
let browserSync = require('browser-sync').create();
let fileInclude = require('gulp-file-include');
let scss = require('gulp-sass');
let autoprefixer = require('gulp-autoprefixer');
let gcmq = require('gulp-group-css-media-queries');
let cleanCSS = require('gulp-clean-css');
let rename = require('gulp-rename');
let uglify = require('gulp-uglify-es').default;
let imagemin = require('gulp-imagemin');
let webp = require('gulp-webp');
let webpHTML = require('gulp-webp-html');
let webpCSS = require('gulp-webpcss');
let ttf2woff = require('gulp-ttf2woff');
let ttf2woff2 = require('gulp-ttf2woff2');
let fonter = require('gulp-fonter');
let svgSprite = require('gulp-svg-sprite');
let fs = require('fs');

function browserSyncFunc() {
	browserSync.init({
		server: {
			baseDir: './' + projectFolder
		},
		port: 3000,
		notify: false
	});
}

function html(done) {
	src(path.src.html).pipe(webpHTML()).pipe(fileInclude()).pipe(dest(path.build.html)).pipe(browserSync.stream());
	return done();
}

function css(done) {
	src(path.src.css)
		.pipe(
			scss({
				outputStyle: 'expanded'
			}).on('error', scss.logError)
		)
		.pipe(gcmq())
		.pipe(autoprefixer([ 'last 5 version' ], { cascade: true }))
		.pipe(webpCSS())
		.pipe(dest(path.build.css))
		.pipe(cleanCSS())
		.pipe(
			rename({
				extname: '.min.css'
			})
		)
		.pipe(dest(path.build.css))
		.pipe(browserSync.stream());
	return done();
}

function js(done) {
	src(path.src.js)
		.pipe(dest(path.build.js))
		.pipe(uglify())
		.pipe(
			rename({
				extname: '.min.css'
			})
		)
		.pipe(dest(path.build.js))
		.pipe(browserSync.stream());
	return done();
}

function images(done) {
	src(path.src.img)
		.pipe(webp())
		.pipe(dest(path.build.img))
		.pipe(src(path.src.img))
		.pipe(
			imagemin({
				progressive: true,
				interlaced: true,
				optimizationLevel: 3,
				svgoPlugins: [ { removeViewBox: true } ]
			})
		)
		.pipe(dest(path.build.img))
		.pipe(src(sourceFolder + 'icon/favicon/**'))
		.pipe(dest(projectFolder + 'icon/favicon/'));
	return done();
}

function otf2ttf(done) {
	src([ sourceFolder + 'fonts/*.otf' ])
		.pipe(
			fonter({
				formats: [ 'ttf' ]
			})
		)
		.pipe(dest(sourceFolder + 'fonts/'));
	return done();
}

function fonts(done) {
	src(path.src.fonts).pipe(ttf2woff()).pipe(dest(path.build.fonts));
	src(path.src.fonts).pipe(ttf2woff2()).pipe(dest(path.build.fonts));
	return done();
}

function putFonts(done) {
	return fs.readdir(path.build.fonts, function(err, items) {
		if (items) {
			for (let item of items) {
				let fontName = item.split('.')[0];
				let isWoff = item.split('.')[1] === 'woff';
				if (isWoff) {
					fs.appendFileSync(
						sourceFolder + 'scss/_fonts.scss',
						'@include font("' + fontName + '", "' + fontName + '", "400", "normal");\r\n'
					);
				}
			}
			return done();
		} else {
			return done();
		}
	});
}

function svg2Sprite(done) {
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
	done();
}

function wathcFiles() {
	gulp.watch(path.watch.html, html);
	gulp.watch(path.watch.css, css);
	gulp.watch(path.watch.js, js);
}

gulp.task('js', js);
gulp.task('css', css);
gulp.task('html', html);
gulp.task('images', images);
gulp.task('otf2ttf', otf2ttf);
gulp.task('fonts', fonts);
gulp.task('putFonts', putFonts);
gulp.task('svg2Sprite', svg2Sprite);

let start = gulp.series(gulp.parallel(images, svg2Sprite, otf2ttf), fonts, putFonts);
gulp.task('start', start);

let watch = gulp.parallel(gulp.parallel(js, css, html), wathcFiles, browserSyncFunc);
gulp.task('watch', watch);

gulp.task('default', watch);
