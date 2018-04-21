const { ipcRenderer } = require('electron');
const untildify = require('untildify');
const Text = require('./models/Text.js');
const ErrorText = require('./models/ErrorText.js');

const addTextToOutput = (el, data) => {
    if (el) {
        el.innerHTML += `${data.output}`;
        el.scrollTop = el.scrollHeight;
    }
}

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

const View = {
    get: () => {
        return window.location.hash.substring(1)
    },

    set: (view) => {
        return window.location.hash = view;
    }

}

const toggleShowingClass = (el) => {
    return el.classList.toggle('showing');
}

const setView = (view) => {
    let viewToUse = view ? view : View.get();
    let views = Array.from(document.querySelectorAll('section[data-view]'));

    let currentView = views.find((v) => {
        return v.dataset.view === View.get();
    });

    let newView = views.find((v) => {
        return v.dataset.view === viewToUse;
    });

    if (currentView && currentView.classList.contains('showing') && currentView.dataset.view === viewToUse) {
        return;
    }

    currentView.classList.remove('showing');
    newView.classList.add('showing');

    View.set(viewToUse);
}

const _onNavClick = (event) => {
    event.preventDefault();
    let thisView = event.target.dataset.view;
    setView(thisView);
}

document.addEventListener("DOMContentLoaded", (event) => {
    setView();

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
    });

    ipcRenderer.on('button-return', (event, args) => {
        console.log(args);
    });

    document.getElementById('settings').addEventListener('submit', (e) => {
        e.preventDefault();
        let form = serializeForm(event.target);
        ipcRenderer.send('setting-save', form);
    });;

    let navButtons = Array.from(document.querySelectorAll('nav a'));
    navButtons.forEach((button) => {
        button.addEventListener('click', _onNavClick);
    })
});
