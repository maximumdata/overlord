const stores = require('../stores');
const Task = require('../models/Task.js');
const isWin = process.platform.match(/^win/);

module.exports = new Task({
    name: 'Post Nuke Maven',
    command: `mvn${isWin ? '.cmd' : ''}`,
    container: 'nukemaven-out',
    args: ['clean', 'install',
    '-P', 'publish,local,install,deploy-externals',
    '-D', 'host=miked-aem.vectorform.com:4503',
    '-D', 'minify=false',
    '-f', `${stores.filePaths.get('root')}`]
});
