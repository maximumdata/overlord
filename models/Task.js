const { spawn } = require('child_process');
// const { mainWindow } = require('../main.js');
const { ipcMain } = require('electron');
const notifier = require('node-notifier');
// this will be a class that can run a child process and pipe output and erorrs to log files.
// you will be able to require it and instantiate with a name, a command to run, and log titles

// these need to happen in the rendered, use ipcRenderer and ipcMain to communicate the PIDs back and forth
// https://www.christianengvall.se/ipcmain-and-ipcrenderer/
// https://stackoverflow.com/questions/36031465/electron-kill-child-process-exec

class Task {
    constructor(opts) {
        this.name = opts.name;
        this.command = opts.command;
        this.args = opts.args;
        this.cwd = opts.cwd || '.';
        this.container = 'output';
    }

    run(window) {
        try {
            let spawnedProc = spawn(this.command, this.args);//, { cwd: this.cwd });

            window.processes.push(spawnedProc);

            spawnedProc.stdout.on('data', (data) => {
                setTimeout(() => {
                    window.send('task-stdout', {
                        container: this.container,
                        task: this.name,
                        data
                    });
                }, 200);
            });

            spawnedProc.stderr.on('data', (data) => {
                setTimeout(() => {
                    window.send('task-stderr', {
                        container: this.container,
                        task: this.name,
                        data
                    });
                }, 200);
            });

            spawnedProc.on('close', (code) => {
                if (code !== 143) {
                    let index = window.processes.indexOf(spawnedProc);

                    if (index) { window.processes.splice(index, 1); }

                    window.send('task-close', {
                        container: this.container,
                        task: this.name,
                        code
                    });

                    notifier.notify({
                        title: `Task complete`,
                        message: `${this.name} has completed. Check the console output for more details.`,
                        wait: true
                    });

                }
            });

            notifier.on('click', function(notifierObject, options) {
              window.restore();
            });
        } catch (e) {
            console.log(e)
        } finally {
            // console.log('finally');
        }
    }

}

module.exports = Task;
