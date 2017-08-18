const fs = require('fs');
const path = require('path');
const gulp = require('gulp');
const webpack = require('webpack-stream');
const merge = require('merge-stream');

const webpackProdConfig = require('./webpack.prod.config.js');

const scriptsPath = 'src/widgets';

function getFolders(dir) {
    return fs.readdirSync(dir)
      .filter(file => {
        return fs.statSync(path.join(dir, file)).isDirectory();
      });
}

gulp.task('default', () => {

    const folders = getFolders(scriptsPath);

    const tasks = folders.map(folder => {

        const config = webpackProdConfig(scriptsPath, folder, 'production');

        return gulp.src(path.join(scriptsPath, folder, '/main.js'))
            .pipe(webpack(config))
            .pipe(gulp.dest(path.join('widgets', folder)));
    });

    return merge(tasks);

});

gulp.task('watch', () => {
    gulp.watch('src/**/**/**/*.*', ['default']);
});