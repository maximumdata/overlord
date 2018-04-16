const { app, Menu, BrowserWindow, ipcMain, Tray } = require('electron');
const autoUpdater = require('electron-updater').autoUpdater;
const isDev = require('electron-is-dev');
const notifier = require('node-notifier');
const path = require('path');
const fixPath = require('fix-path')();
const stores = require('./stores');
let mainWindow; // do this so that the window object doesn't get GC'd

/**
 * Called when a new window needs to be created. Will create the renderer window,
 * add the menu, set window specific events, and load index.html
 * @return {null}
 */
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
    initAutoUpdate();

    let trayIcon = new Tray(`./renderer/assets/img/tray.png`);
    tasks.submenu.push({
        label: 'Maximize',
        click:(_,window)=>{
            if (window.isMinimized()) {
                window.restore();
            }
            window.maximize();
        }
    });
    let trayMenu = Menu.buildFromTemplate(tasks.submenu);

    trayIcon.setContextMenu(trayMenu);
}

/**
 * Sets up the autoUpdater
 * @return {null}
 */
const initAutoUpdate = () => {
    if (isDev || process.platform === 'linux') {
        return;
    }

    autoUpdater.checkForUpdates();
    autoUpdater.signals.updateDownloaded(showUpdateNotification);
}

/**
 * Shows update available notification
 * @param  {Object} it Notifcation object from autoUpdater
 * @return {null}
 */
const showUpdateNotification = (it) => {
    it = it || {};
    const restartNowAction = 'Restart Now';

    const versionLabel = it.label ? `Version ${it.version}` : 'The latest version';

    notifier.notify({
        title: 'A new update is ready to install.',
        message: `${versionLabel} has been downloaded and will be automatically installed after restart.`,
        closeLabel: 'Okay',
        actions: restartNowAction
    }, (err, res, meta) => {
        if (err) throw err;
        if (meta.activationValue !== restartNowAction) { return; }
        autoUpdater.quitAndInstall();
    });
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
app.on('ready', createMainWindow);

app.on('before-quit', beforeQuit);

// these next two are to bring things in line with macOS standards
app.on('window-all-closed', windowAllClosed);

app.on('activate', activate);
