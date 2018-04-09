const { spawn } = require('child_process');

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
    }

    run() {
        try {
            let ls = spawn(this.command, this.args, { detached: true });

            ls.stdout.on('data', (data) => {
              console.log(`${data}`);
            });

            ls.stderr.on('data', (data) => {
              console.log(`stderr: ${data}`);
            });

            ls.on('close', (code) => {
              console.log(`child process exited with code ${code}`);
            });
        } catch (e) {
            console.log(e)
        } finally {
            console.log('finally');
        }



    }
}


module.exports = Task;
