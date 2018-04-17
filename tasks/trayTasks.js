module.exports = (mainWindow) => {
    return [{
        label: 'Show/Hide',
        click: () => {
            if (mainWindow.isMinimized()) {
                mainWindow.restore();
            } else {
                mainWindow.minimize();
            }
        }
    }, {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
            force_quit = true;
            app.quit();
        }
    }];
}
