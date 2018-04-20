const { ipcRenderer } = require('electron');
const Text = require('./models/Text.js');
const ErrorText = require('./models/ErrorText.js');

const addTextToOutput = (el, data) => {
    if (el) {
        el.innerHTML += `${data.output}`;
        el.scrollTop = el.scrollHeight;
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    ipcRenderer.on('task-stdout', (event, arg) => {
        let element = document.getElementById(arg.container);
        if (element) { addTextToOutput(element, new Text(arg.data)); }
    });

    ipcRenderer.on('task-stderr', (event, arg) => {
        let element = document.getElementById(arg.container);
        if (element) { addTextToOutput(element, new ErrorText(arg.data)); }
    });

    ipcRenderer.on('task-close', (event, arg) => {
        console.log(`finished ${arg.task} with ${arg.code}`);
    });

    ipcRenderer.on('path', (ev, arg) => {
        console.log(arg);
    })
});
