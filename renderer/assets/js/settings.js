const { ipcRenderer } = require('electron');
const untildify = require('untildify');

ipcRenderer.on('button-return', (event, args) => {
    console.log(args);
})


const serializeForm = (form) => {
    let obj = {};
    let elements = [].slice.call(form.querySelectorAll('input[type="text"]'));
    elements.forEach((input) => {
        let name = input.name;
        let value = input.value;

        if (input.dataset.dir) {
            value = untildify(value);
        }

        if( name) {
            obj[name] = value;
        }
    });
    return obj;
}

document.addEventListener('DOMContentLoaded', function(e) {
    document.getElementById('settings').addEventListener('submit', function(e) {
        e.preventDefault();
        let form = serializeForm(event.target);
        ipcRenderer.send('setting-save', form);
    });;
});
