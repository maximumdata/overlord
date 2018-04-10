const tasks = [require('./maven'), require('./nukemaven')];

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
