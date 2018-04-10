const { app, Menu, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const stores = require('./stores');
let mainWindow; //do this so that the window object doesn't get GC'd

app.on('ready', function() {
    let { x, y, width, height } = stores.window.get('windowBounds');

    mainWindow = new BrowserWindow({ x, y, width, height });

    let tasks = require('./tasks')(mainWindow);

    let menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                //{ label: 'About App', selector: 'orderFrontStandardAboutPanel:'},
                { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: function() {force_quit=true; app.quit();}}
            ]
        }, {
            label: 'Tasks',
            submenu: tasks.submenu
        }
    ]);
    Menu.setApplicationMenu(menu);

    // this is called during moves and resizes on linux, not on macos, dunno about windows
    // might wanna look into that at some point, but it won't break anything for now
    mainWindow.on('move', () => {
        stores.window.set('windowBounds', mainWindow.getBounds());
    });

    mainWindow.on('resize', () => {
        stores.window.set('windowBounds', mainWindow.getBounds());
    });

    mainWindow.loadURL('file://' + path.join(__dirname, 'renderer/index.html'));
    // mainWindow.webContents.openDevTools()
});

// http://electron.rocks/different-ways-to-communicate-between-main-and-renderer-process/
// ipcMain.on('task-start', _ => {
//     console.log('Filewatch started')
//     mainWindow.webContents.send('changedfiles', 'examplePath');
// })
