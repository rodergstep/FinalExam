var gulp = require('gulp'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    spritesmith = require('gulp.spritesmith');
plumber = require('gulp-plumber'),
    watch = require('gulp-watch'),
    autoprefixer = require('gulp-autoprefixer'),
    prettify = require('gulp-prettify'),
    // babel = require("gulp-babel"),
    clean = require('gulp-clean'),
    webserver = require('gulp-webserver');


var path = {
    build: {
        root: 'build/',
        html: 'build/',
        css: 'build/css/',
        js: 'build/js/',
        img: 'build/images/',
        fonts: 'build/fonts/',
        vendors: 'build/external/'
    },
    src: {
        html: 'src/*.html',
        sass: 'src/sass/*.scss',
        js: 'src/js/*.js',
        img: 'src/images/*.*',
        fonts: 'src/fonts/**/*.*',
        vendors: 'src/external/**/*.*',
    },
    watch: {
        html: 'src/**/*.html',
        sass: 'src/**/*.scss',
        js: 'src/js/*.js',
        img: 'src/images/**/*',
        fonts: 'src/fonts/**/*.*',
        vendors: 'src/external/**/*.*'
    }
};
// SERVER
gulp.task('webserver', function() {
    gulp.src('build')
        .pipe(webserver({
            livereload: true,
            open: true,
            port: 8080
        }));
});
// HTML
gulp.task('html:build', function() {
    gulp.src(path.src.html)
        .pipe(plumber())
        .pipe(rigger())
        .pipe(prettify({
            indent_size: 4
        }))
        .pipe(gulp.dest(path.build.html));

    return gulp.src('build/*.html', {
            read: false
        })
        .pipe(clean());
});

// CSS
gulp.task('style:build', function() {
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
        .pipe(gulp.dest(path.build.css));
    return gulp.src('build/css/*.css', {
            read: false
        })
        .pipe(clean());
});

// JS
gulp.task('js:build', function() {
    gulp.src(path.src.js)
        .pipe(plumber())
        /*.pipe(babel({
             presets: ['es2015']
         }))*/
        .pipe(rigger())
        .pipe(gulp.dest(path.build.js));
    return gulp.src('build/js/*.js', {
            read: false
        })
        .pipe(clean());
});

// IMAGES
gulp.task('image:build', function() {
    gulp.src(path.src.img)
        .pipe(plumber())
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{
                removeViewBox: false
            }],
            use: [pngquant()],
            interlaced: true
        }))
        .pipe(gulp.dest(path.build.img));
    return gulp.src('build/images/**/*.*', {
            read: false
        })
        .pipe(clean());
});

// SPRITE
gulp.task('sprite:build', function() {
    var spriteData = gulp.src('src/images/sprite/*.png').pipe(spritesmith({
        retinaSrcFilter: ['src/images/sprite/*-2x.png'],
        retinaImgName: 'sprite-2x.png',
        retinaImgPath: '../images/sprite-2x.png',
        imgName: 'sprite.png',
        cssName: '_sprite.scss',
        padding: 20,
        algorithm: 'diagonal',
        imgPath: '../images/sprite.png'
    }));
    spriteData.img.pipe(gulp.dest('src/images/'));
    spriteData.css.pipe(gulp.dest('src/sass/'));

});


// FONTS
gulp.task('font:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts));
    return gulp.src('build/fonts/**/*.*', {
            read: false
        })
        .pipe(clean());
});

// Assets
gulp.task('vendor:build', function() {
    gulp.src(path.src.vendors)
        .pipe(gulp.dest(path.build.vendors));
    return gulp.src('build/external/**/*.*', {
            read: false
        })
        .pipe(clean());
});

gulp.task('build', [
    'html:build',
    'style:build',
    'js:build',
    'image:build',
    'sprite:build',
    'font:build',
    'vendor:build',
    'webserver'
]);

gulp.task('watch', function() {

    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.sass], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('font:build');
    });
    watch([path.watch.vendors], function(event, cb) {
        gulp.start('vendor:build');
    });

});

gulp.task('default', ['build', 'watch']);
