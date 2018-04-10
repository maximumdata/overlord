const { spawn } = require('child_process');
const { mainWindow } = require('../main.js');
const { ipcMain } = require('electron');
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
        this.container = opts.container;
    }

    run(window) {
        let cmd = `${this.command} ${this.args}`;
        window.send('task-stdout', cmd);
        try {
            let ls = spawn(this.command, this.args);

            ls.stdout.on('data', (data) => {
              window.send('task-stdout', {
                  container: this.container,
                  task: this.name,
                  data
              })
            });

            ls.stderr.on('data', (data) => {
                window.send('task-stderr', {
                    container: this.container,
                    task: this.name,
                    data
                })
            });

            ls.on('close', (code) => {
                window.send('task-close', {
                    container: this.container,
                    task: this.name,
                    code
                })
            });
        } catch (e) {
            console.log(e)
        } finally {
            console.log('finally');
        }
    }

}

module.exports = Task;