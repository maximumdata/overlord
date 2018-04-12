const Text = require('./Text');

class ErrorText extends Text {
    get output() {
        return `<span class="error">${this.text}</span>`;
    }
}

module.exports = ErrorText;
