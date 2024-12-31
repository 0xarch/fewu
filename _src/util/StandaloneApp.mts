class StandaloneApp {
    version: string;
    name: string;
    constructor({ version, name } = { version: '1.0.0', name: 'org.example.App' }) {
        this.version = version;
        this.name = name;
    }

    humanize(): string {
        let content = '';
        content += `${this.name}, version ${this.version}`;
        return content;
    }
}

export default StandaloneApp;