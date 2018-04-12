class Text {
    constructor(text) {
        this.text = text;
    }
    get output() {
        return `${this.text}`;
    }
}


module.exports = Text;
