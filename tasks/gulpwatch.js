const stores = require('../stores');
const Task = require('../models/Task.js');
const untildify = require('untildify');
const path = require('path');
const { app } = require('electron');

// const what = app.getAppPath();
// const huh = path.join(what, '..','app.asar.unpacked', 'deps', 'node_modules', 'gulp', 'bin', 'gulp.js');
const isWin = process.platform.match(/^win/);

module.exports = new Task({
    name: 'Gulp Watch',
    container: 'nukemaven-out',
    command: `gulp${isWin ? '.cmd' : ''}`,
    args: [
        //huh, //path.join(__dirname, '../node_modules/gulp/bin/gulp.js'),
        //`${path.join(app.getAppPath(), 'app.asar.unpacked','deps','node_modules','gulp','bin','gulp.js')}`,
        '--gulpfile',
        untildify('~/dev/mopar/frontend/gulpfile.js'),
        'watch'
    ]
});
