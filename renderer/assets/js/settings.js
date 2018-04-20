const { ipcRenderer } = require('electron');

let buttons = [].slice.call(document.getElementsByTagName('button'));
buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
        let input = button.parentNode.querySelector(`input`);
        // getTextFromBox(input.value);
        // saveSetting(button.dataset.for, input.value);
        ipcRenderer.send('setting-save', {key: button.dataset.for, value: input.value});
    });
});

ipcRenderer.on('button-return', (event, args) => {
    console.log(args);
})
