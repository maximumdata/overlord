const {settings} = require('../stores');
const Task = require('../models/Task.js');
const isWin = process.platform.match(/^win/);


module.exports = new Task({
    name: 'AEM Sync',
    container: 'nukemaven-out',
    command: `aemmultisync${isWin ? '.cmd' : ''}`,
    args: [
        '-t',
        'http://admin:admin@miked-aem.vectorform.com:4503',
        '-w',
        '~/dev/mopar/frontend,~/dev/dam',
        '-e',
        '**/node_modules/*'
    ]
});

/*
module.exports = new Task({
    name: 'AEM Sync',
    container: 'nukemaven-out',
    command: `aemmultisync${isWin ? '.cmd' : ''}`,
    args: [
        '-t',
        settings.get('remote'),
        '-w',
        `${settings.get('repo')},${settings.get('dam')}`
    ]
});

console.log(module.exports);
*/
