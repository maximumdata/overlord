const tasks = [require('./maven'), require('./nukemaven')];

module.exports = (window) => {
    let max = {
        name: 'Maximize',
        run:(win)=>{
            if (win.isMinimized()) {
                win.restore();
            }
            win.maximize();
        }
    };
    tasks.push(max);

    return {
        tasks,
        submenu: tasks.map((task) => {
            return {
                label: task.name,
                click: () => {
                    task.run(window);
                }
            }
        })
    };
}
