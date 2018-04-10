const { ipcRenderer } = require('electron');

document.addEventListener("DOMContentLoaded", function(event) {
    ipcRenderer.on('task-stdout', (event, arg) => {
        let ok = document.getElementById(arg.container);
        if (ok) { ok.innerText += arg.data; }
    });

    ipcRenderer.on('task-stderr', (event, arg) => {
        let ok = document.getElementById(arg.container);
        if (ok) { ok.innerHTML += `<div class="error">${arg.data}</div>`; }
    });

    ipcRenderer.on('task-close', (event, arg) => {
        console.log(`finished ${arg.task} with ${arg.code}`);
    });
});
