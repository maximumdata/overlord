const stores = require('../stores');
const Task = require('../task.js');

module.exports = new Task({
    name: 'nukemaven',
    command: 'mvn',
    args: ['clean', 'install',
    '-P', 'publish,local,install,deploy-externals',
    '-D', 'host=miked-aem.vectorform.com:4503',
    '-D', 'minify=false',
    '-f', `${stores.filePaths.get('root')}`]
});
