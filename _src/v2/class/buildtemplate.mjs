class BuildTemplate {
    type;
    text;
    basedir;
    filename;
    constructor(type, text, { basedir, filename }) {
        this.type = type;
        this.text = text;
        this.basedir = basedir;
        this.filename = filename;
    }
    getBase() {
        return {
            basedir: this.basedir,
            filename: this.filename
        }
    }
}

export default BuildTemplate;