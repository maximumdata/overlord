const Store = require('../store.js');

module.exports = new Store({
  configName: 'window-preferences',
  defaults: {
    windowBounds: { width: 800, height: 600, x: 566, y: 281}
  }
});
