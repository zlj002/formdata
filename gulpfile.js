var gulp = require('gulp'),
    csso = require('gulp-csso'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    clean = require('gulp-clean'),
    rename = require('gulp-rename'),
    rev = require('gulp-rev'),
    watch = require('gulp-watch'),
    revCollector = require('gulp-rev-collector');
var config = require("./config.json");
//var plugins = require('gulp-load-pluginsk')();
//var clean = plugins.clean;
gulp.task('clean', function () {
    return gulp.src(config.dist, { read: false })
        .pipe(clean());
});
gulp.task('css', function () {
    return gulp.src(config.css.src)
        .pipe(csso())
        .pipe(rename(function (path) {
            path.basename += ".min";
            path.extname = ".css";
        }))
        .pipe(rev())
        .pipe(gulp.dest(config.css.dist))
        .pipe(rev.manifest())
        .pipe(gulp.dest(config.css.rev))
});
gulp.task('js', function () {
    return gulp.src(config.js.src)
        .pipe(uglify())
        //.pipe(rename(function (path) {
        //    path.basename += ".min";
        //    path.extname = ".js";
        //}))
        //.pipe(rev()) 
        .pipe(gulp.dest(config.js.dist))
        //.pipe(rev.manifest())
        //.pipe(gulp.dest(config.js.rev))
});
gulp.task('rev', function () {
    return gulp.src(["dist/rev/css/*.json", "test/test.html"]) 
        .pipe(revCollector({
            replaceReved: true
        }))
        .pipe(gulp.dest(config.dist))
        
});
gulp.task('watch', function () { 
    gulp.watch(config.js.src, ['js']);
    return gulp.watch(config.js.src, function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
});
//gulp.task('default', [ 'css','js','rev','watch']);
gulp.task('default', ['css', 'js', 'rev']);