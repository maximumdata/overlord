const stores = require('../stores');
const Task = require('../models/Task.js');
const untildify = require('untildify');

module.exports = new Task({
    name: 'Gulp Watch',
    container: 'nukemaven-out',
    command: `gulp`,
    args: [
        '--gulpfile',
        untildify('~/dev/mopar/frontend/gulpfile.js'),
        'watch'
    ]
});
