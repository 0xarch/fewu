let parsers = {};

try {
    let ejs = await import('ejs');
    parsers.ejs = (template, opt, prov) => {
        return ejs.render(template, { ...opt, ...prov });
    }
} catch (e) {
    console.error('Error during loading EJS parser.');
}

try {
    let pug = await import('pug');
    parsers.pug = (template, opt, prov) => {
        return pug.compile(template, opt)(prov);
    }
} catch (e) {
    console.error('Error during loading PUG parser.');
}

export default parsers;
