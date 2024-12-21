import StandaloneApp from "#util/ts/StandaloneApp";

const app = new StandaloneApp({
    version: '1.0.0',
    name: 'io.fewu.help'
});

declare interface display {
    [key: string]: string | string[]
}

async function App() {
    console.info(app.humanize());
    let pad = 0
    let displays: display = {
        '--new <path> <title> <--arguments-->': [
            `Touch a markdown file with basic information frame in the posts directory.`,
            `This argument will override all arguments.`],

        '     > --tag, -t': 'Make --new use specific tags. For multiple tags, use <space> to split.',
        '     > --category, -c': 'Make --new use specific category.',

        '--init': [
            `Setup environment.`,
            `This will make some directories and write some files.`,
            `This argument will override all arguments.`],

        '--help': [
            `Display this page.`,
            `This argument will override all arguments.`],

        '--release': 'Build website in release mode.',

        '--devel': 'Build website in developer mode.',

        '--config $CONFIG_FILE': 'Choose a configuration file.',

        '--theme $THEME_NAME': 'Override theme name in configuration file.'
    };

    for (let k in displays) {
        if (k.length + 2 > pad)
            pad = k.length + 2
    }

    for (let k in displays) {
        if (!Array.isArray(displays[k]))
            console.log(k.padEnd(pad), displays[k])
        else {
            console.log(k.padEnd(pad), displays[k].shift())
            displays[k].forEach(v =>
                console.log(' '.repeat(pad), v))
        }
        console.log();
    }
}

export default App;