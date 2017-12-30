var gulp = require('gulp');
var spawn = require('child_process').spawn;
var node;

gulp.task('server', () => {
    if (node) node.kill()
    node = spawn('node', ['app.js'], {stdio: 'inherit'})
    node.on('close', (code) => {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...')
        }
    })
})

gulp.task('default', () => {
    gulp.run('server')
    gulp.watch(['./app.js','./theBigRouter.js'], () => {
        gulp.run('server')
    })
})
