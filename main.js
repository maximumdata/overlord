const { app, Menu, BrowserWindow, ipcMain, Tray, nativeImage } = require('electron');
const isDev = require('electron-is-dev');
const notifier = require('node-notifier');
const npm = require('npm-cmd');
const path = require('path');
const fixPath = require('fix-path')();
const stores = require('./stores');
let mainWindow; // do this so that the window object doesn't get GC'd

// oh my god
// Add the node_modules/.bin directory to the PATH
var PATH_SEPARATOR = process.platform.match(/^win/) ? ';' : ':';
process.env.PATH = path.join(app.getAppPath(), '..','app.asar.unpacked', 'deps', 'node_modules', '.bin') + PATH_SEPARATOR + process.env.PATH;
process.env.PATH = path.join(app.getAppPath(), 'deps','node_modules','.bin') + PATH_SEPARATOR + process.env.PATH;
process.env.PATH = path.join(app.getAppPath(), 'deps', 'apache-maven-3.5.3','bin') + PATH_SEPARATOR + process.env.PATH;
process.env.PATH = path.join(app.getAppPath(), 'app.asar.unpacked','deps', 'apache-maven-3.5.3','bin') + PATH_SEPARATOR + process.env.PATH;


const checkIfNpmInstallRan = () => {
    const fs = require('fs');
    let rootPath = isDev ? `${path.join(app.getAppPath(), 'deps')}` : `${path.join(app.getAppPath(), '..','app.asar.unpacked','deps')}`;
    let p = path.join(rootPath, 'node_modules','.bin');
    console.log(p);
    if (!fs.existsSync(p)) {
        createMainWindow('loading');
        let cwd = isDev ? `${path.join(app.getAppPath(), 'deps')}` : `${path.join(app.getAppPath(), '..','app.asar.unpacked','deps')}`
        npm.install(['gulp', 'aemmultisync'], {save: true, cwd}, (err) => {
          if (err) {
            mainWindow.loadURL(`file://${path.join(__dirname, `renderer/index.html#error`)}`);
          } else {
            // console.log('Installation succeeded!');
            mainWindow.loadURL(`file://${path.join(__dirname, `renderer/index.html#settings`)}`);
          }
        });
    } else {
        createMainWindow('index');
    }
}

/**
 * Called when a new window needs to be created. Will create the renderer window,
 * add the menu, set window specific events, and load index.html
 * @return {null}
 */
const createMainWindow = (view) => {
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

    mainWindow.loadURL(`file://${path.join(__dirname, `renderer/index.html#${view || 'index'}`)}`);
    // mainWindow.loadURL(`file://${path.join(__dirname, 'renderer/settings.html')}`);
    // this is wicked sloppy
    let tray = new Tray(path.join(__dirname, 'renderer/assets/img/tray.png'));
    let trayTasks = tasks.submenu.concat(require('./tasks/trayTasks.js')(mainWindow, app));
    let trayMenu = Menu.buildFromTemplate(trayTasks);
    tray.setContextMenu(trayMenu);
}

/**
 * Event handler for setting the window location to the window store
 * @return {null}
 */
const onMoveResize = () => {
    stores.window.set('windowBounds', mainWindow.getBounds());
}

/**
 * checks for running child_processes and kills them before quitting the app
 * @return {null}
 */
const beforeQuit = () => {
    if (mainWindow.processes.length) {
        mainWindow.processes.forEach((proc) => {
            proc.kill();
        });
    }
}

/**
 * checks if running on macOS, and keeps the tray icon open if so
 * @return {null}
 */
const windowAllClosed = () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
}

/**
 * checks if the app was opened from an open tray icon on macOS with no windows
 * @return {null}
 */
const activate = () => {
    if (mainWindow === null) {
        createWindow();
    }
}

// event handlers
app.on('ready', checkIfNpmInstallRan);

app.on('before-quit', beforeQuit);

// these next two are to bring things in line with macOS standards
app.on('window-all-closed', windowAllClosed);

app.on('activate', activate);

ipcMain.on('setting-save', (event, args) => {
    Object.entries(args).forEach(([key, value]) => {
        stores.settings.set(key, value);
    });
    event.sender.send('button-return', stores.settings.getAll())
});
