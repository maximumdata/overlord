const tasks = [require('./maven'), require('./nukemaven'), require('./ams'), require('./gulpwatch')];

module.exports = (window) => {
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
