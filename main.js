const { app, Menu, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fixPath = require('fix-path')();
const stores = require('./stores');
let mainWindow; // do this so that the window object doesn't get GC'd

const createMainWindow = () => {
    // create the new window and set the processes array on it
    mainWindow = new BrowserWindow(stores.window.get('windowBounds'));
    mainWindow.processes = [];

    // tasks need a reference to the window to send messages currently
    // TODO: clean this up so that tasks can access the processes var without this clumsy ref passing
    // TODO: move this to it's own file, it's just clutter here
    let tasks = require('./tasks')(mainWindow);
    let menu = Menu.buildFromTemplate([
        {
            label: 'File',
            submenu: [
                { label: 'Open Dev Tools', accelerator: 'CmdOrCtrl+Shift+I', click: () => { mainWindow.webContents.toggleDevTools(); } },
                { label: 'Quit', accelerator: 'CmdOrCtrl+Q', click: () => { force_quit=true; app.quit(); } }
            ]
        },
        {
            label: 'Tasks',
            submenu: tasks.submenu
        }
    ]);
    Menu.setApplicationMenu(menu);

    // 'move' is called during moves and resizes on linux, not on macos, dunno about windows
    // might wanna look into that at some point, but it won't break anything for now
    mainWindow.on('move', onMoveResize);
    mainWindow.on('resize', onMoveResize);

    // macOS standard
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    mainWindow.loadURL(`file://${path.join(__dirname, 'renderer/index.html')}`);
}

const onMoveResize = () => {
    stores.window.set('windowBounds', mainWindow.getBounds());
}

// event handlers
app.on('ready', createMainWindow);

app.on('before-quit', function() {
    if (mainWindow.processes.length) {
        mainWindow.processes.forEach(function(proc) {
            proc.kill();
        });
    }
});

// these next two are to bring things in line with macOS standards
app.on('window-all-closed', function() {
    if (process.platform != 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
