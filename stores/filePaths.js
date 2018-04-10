const Store = require('../models/Store.js');
const untildify = require('untildify');

module.exports = new Store({
    configName: 'file-paths',
    defaults : {
        frontend: untildify('~/dev/mopar/frontend'),
        dam: untildify('~/dev/dam'),
        root: untildify('~/dev/mopar')
    }
});
