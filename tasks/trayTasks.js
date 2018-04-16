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
    }]
}
