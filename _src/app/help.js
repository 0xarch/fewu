import CONSTANTS from "#core/constants";

function displayHelp() {
    let pad = 0
    let displays = {
        '--new': [
            `Touch a markdown file with basic information frame in the posts directory.`,
            `This argument will override all arguments.`],

        '     > --tag': 'Make --new use specific tags. For multiple tags, use + to split.',
        '     > --category': 'Make --new use specific category.',
        '     > --title': 'Make --new use specific title.',

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

        '--theme $THEME_NAME': 'Override theme name in configuration file.',

        '--language $LANG': 'Override language in configuration file'
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
        console.log()
    }

    console.log('-'.repeat(pad))
    console.log('Fewu', CONSTANTS.FEWU_RELEASE_VERSION)
    console.log('Insider',CONSTANTS.FEWU_INSIDER_VERSION)
    console.log('OS',CONSTANTS.OS_UNAME)
}

export default displayHelp;