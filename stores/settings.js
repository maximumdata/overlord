const Store = require('../models/Store.js');

module.exports = new Store({
    configName: 'settings',
    defaults : {
        dam: '',
        repo: '',
        remote: ''
    }
});
