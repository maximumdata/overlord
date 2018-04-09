const stores = require('../stores');
const Task = require('../task.js');

module.exports = new Task({
    name: 'maven',
    command: 'mvn',
    args: ['clean', 'install',
        '-P', 'publish,local,install',
        '-D', 'host=miked-aem.vectorform.com:4503',
        '-D', 'minify=false',
        '-f', `${stores.filePaths.get('root')}`]
});
