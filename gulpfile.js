var gulp = require('gulp'),
    BrowserSync = require('browser-sync'), //引入模块
    imagemin = require('gulp-imagemin'), //图片压缩
    sass = require('gulp-ruby-sass'), //sass
    minifycss = require('gulp-minify-css'), //css压缩
    jshint = require('gulp-jshint'), //js检查
    uglify = require('gulp-uglify'), //js压缩
    rename = require('gulp-rename'), //重命名
    concat = require('gulp-concat'), //合并文件
    clean = require('gulp-clean'), //清空文件夹
    tinylr = require('tiny-lr'), //livereload
    server = tinylr();
gulp.task('browser-sync', function() { //注册任务
    BrowserSync({ //调用API
        files: "**", //监听整个项目
        server: {
            baseDir: "./" //监听当前路径
        }
    });
});
//gulp.task('default', ["browser-sync"]);
// HTML处理
gulp.task('html', function() {
    var htmlSrc = './*.html',
        htmlDst = './dist/';
    gulp.src(htmlSrc)
        .pipe(livereload(server))
        .pipe(gulp.dest(htmlDst))
});
// 样式处理
gulp.task('css', function() {
    var cssSrc = './css/*.scss',
        cssDst = './dist/css';
    gulp.src(cssSrc)
        .pipe(sass({
            style: 'expanded'
        }))
        .pipe(gulp.dest(cssDst))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(minifycss())
        .pipe(livereload(server))
        .pipe(gulp.dest(cssDst));
});
// 图片处理
gulp.task('img', function() {
    var imgSrc = './img/**/*',
        imgDst = './dist/img';
    gulp.src(imgSrc)
        .pipe(imagemin())
        .pipe(livereload(server))
        .pipe(gulp.dest(imgDst));
})
// js处理
gulp.task('js', function() {
    var jsSrc = './js/*.js',
        jsDst = './dist/js';
    gulp.src(jsSrc)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('default'))
        .pipe(concat('main.js'))
        .pipe(gulp.dest(jsDst))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(livereload(server))
        .pipe(gulp.dest(jsDst));
});
// 清空图片、样式、js
gulp.task('clean', function() {
    gulp.src(['./dist/css', './dist/js', './dist/img'], {
            read: false
        })
        .pipe(clean());
});
// 默认任务 清空图片、样式、js并重建 运行语句 gulp
gulp.task('default', ['clean'], function() {
    gulp.start('html', 'css', 'img', 'js');
});
// 监听任务 运行语句 gulp watch
gulp.task('watch', function() {
    // 监听html
    gulp.watch('./*.html', function(event) {
        gulp.run('html');
    })
    // 监听css
    gulp.watch('./css/*.scss', function() {
        gulp.run('css');
    });
    // 监听img
    gulp.watch('./img/**/*', function() {
        gulp.run('img');
    });
    // 监听js
    gulp.watch('./js/*.js', function() {
        gulp.run('js');
    });
});