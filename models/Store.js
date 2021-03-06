const electron = require('electron');
const path = require('path');
const fs = require('fs');

class Store {
    constructor(opts) {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        this.path = path.join(userDataPath, `${opts.configName}.json`);
        this.data = parseDataFile(this.path, opts.defaults);
    }

    get(key) {
        return this.data[key];
    }

    set(key, val) {
        this.data[key] = val;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    getAll() {
        return this.data;
    }
}

const parseDataFile = (filePath, defaults) => {
    if (!fs.existsSync(filePath)) {
        return defaults;
    }
    return JSON.parse(fs.readFileSync(filePath));
}

module.exports = Store;
