const { app, Menu, BrowserWindow } = require('electron');
const path = require('path');
const stores = require('./stores');
const tasks = require('./tasks');
let mainWindow; //do this so that the window object doesn't get GC'd

let menu = Menu.buildFromTemplate([
    {
        label: 'File',
        submenu: [
            { label: 'About App', selector: 'orderFrontStandardAboutPanel:'},
            { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function() {force_quit=true; app.quit();}}
        ]
    }, {
        label: 'Tasks',
        submenu: [
            { label: 'Maven', click: () => {
                    tasks.maven.run();
                }
            },
            { label: 'Post Nuke Maven', click: () => {
                    tasks.nukemaven.run();
                }
            }
        ]
    }
]);

// When our app is ready, we'll create our BrowserWindow
app.on('ready', function() {

    Menu.setApplicationMenu(menu);

    // First we'll get our height and width. This will be the defaults if there wasn't anything saved
    let { x, y, width, height } = stores.window.get('windowBounds');

    // Pass those values in to the BrowserWindow options
    mainWindow = new BrowserWindow({ x, y, width, height });

    // this is called during moves and resizes
    mainWindow.on('move', () => {
        stores.window.set('windowBounds', mainWindow.getBounds());
    });

    mainWindow.loadURL('file://' + path.join(__dirname, 'index.html'));
    mainWindow.webContents.openDevTools()
});
