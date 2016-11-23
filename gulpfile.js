var gulp = require('gulp'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    spritesmith = require('gulp.spritesmith'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    prettify = require('gulp-prettify'),
    // babel = require("gulp-babel"),
    clean = require('gulp-clean'),
    browserSync = require('browser-sync');


var path = {
    build: {
        root: 'build/',
        html: 'build/',
        css: 'build/css/',
        js: 'build/js/',
        img: 'build/img/',
        fonts: 'build/fonts/',
        vendors: 'build/libs/'
    },
    src: {
        html: 'src/*.html',
        sass: 'src/sass/*.scss',
        js: 'src/js/*.js',
        img: 'src/img/*.*',
        fonts: 'src/fonts/**/*.*',
        vendors: 'src/libs/**/*.*',
    },
    watch: {
        html: 'src/**/*.html',
        sprite: 'src/img/sprite/**/*',
        sass: 'src/**/*.scss',
        js: 'src/js/*.js',
        img: 'src/img/**/*',
        fonts: 'src/fonts/**/*.*',
        vendors: 'src/libs/**/*.*'
    }
};
// SERVER
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'build'
        },
        notify: false
    });
});

// HTML
gulp.task('html', function() {
    gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(prettify({
            indent_size: 4
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.reload({stream: true}));
    return gulp.src('build/*.html', {
            read: false
        })
        .pipe(clean());
});

// CSS
gulp.task('style', function() {
    gulp.src(path.src.sass)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 30 versions', 'ie >= 8'],
            cascade: false
        }))
        .pipe(cssmin())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.reload({stream: true}));
    return gulp.src('build/css/*.css', {
            read: false
        })
        .pipe(clean());
});

// JS
gulp.task('js', function() {
    gulp.src(path.src.js)
        .pipe(plumber())
        /*.pipe(babel({
             presets: ['es2015']
         }))*/
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.reload({stream: true}));
    return gulp.src('build/js/*.js', {
            read: false
        })
        .pipe(clean());
});

// IMAGES
gulp.task('image', function() {
    gulp.src(path.src.img)
        .pipe(plumber())
        .pipe(cache(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        })))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.reload({stream: true}));
    return gulp.src('build/img/**/*.*', {
            read: false
        })
        .pipe(clean());
});

// SPRITE
gulp.task('sprite', function() {
    var spriteData = gulp.src('src/img/sprite/*.png').pipe(spritesmith({
        retinaSrcFilter: ['src/img/sprite/*-2x.png'],
        retinaImgName: 'sprite-2x.png',
        retinaImgPath: '../img/sprite-2x.png',
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        padding: 20,
        algorithm: 'diagonal',
        imgPath: '../img/sprite.png'
    }));
    spriteData.img.pipe(gulp.dest('src/img/'));
    spriteData.css.pipe(gulp.dest('src/sass/'));

});


// FONTS
gulp.task('font', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.reload({stream: true}));
    return gulp.src('build/fonts/**/*.*', {
            read: false
        })
        .pipe(clean());
});

// VENDORS
gulp.task('vendors', function() {
    gulp.src(path.src.vendors)
        .pipe(concat('libs.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.build.vendors))
        .pipe(browserSync.reload({stream: true}));
    return gulp.src('build/libs/**/*.*', {
            read: false
        })
        .pipe(clean());
});

gulp.task('build', [
    'html',
    'sprite',
    'style',
    'js',
    'image',
    'font',
    'vendors',
    'browser-sync'
]);

gulp.task('watch', function() {

    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.sprite], function(event, cb) {
        gulp.start('sprite');
    });
    watch([path.watch.sass], function(event, cb) {
        gulp.start('style');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('font');
    });
    watch([path.watch.vendors], function(event, cb) {
        gulp.start('vendors');
    });

});

gulp.task('clearcache', function () { return cache.clearAll(); });

gulp.task('default', ['build', 'watch']);
