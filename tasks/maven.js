const stores = require('../stores');
const Task = require('../models/Task.js');
const isWin = process.platform.match(/^win/);

module.exports = new Task({
    name: 'Maven',
    command: `mvn${isWin ? '.cmd' : ''}`,
    container: 'maven-out',
    args: ['clean', 'install',
        '-P', 'publish,local,install',
        '-D', 'host=miked-aem.vectorform.com:4503',
        '-D', 'minify=false',
        '-f', `${stores.filePaths.get('root')}`]
});
