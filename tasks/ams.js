const stores = require('../stores');
const Task = require('../models/Task.js');

module.exports = new Task({
    name: 'AEM Sync',
    container: 'nukemaven-out',
    command: 'aemmultisync',
    args: [
        '-t',
        'http://admin:admin@miked-aem.vectorform.com:4503',
        '-w',
        '~/dev/mopar/frontend,~/dev/dam'
    ]
});
