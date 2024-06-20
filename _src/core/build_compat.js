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

// Needs Impl in 1.2.5 or 1.3.0
if (database.config?.build?.useCustomParser){
    let custom = await dynamicImport(database.config.build.useCustomParser);
    if(custom === null){
        console.error(`Error during loading CUSTOM parser<${database.config.build.useCustomParser}>.`);
    } else {
        parsers.custom = custom;
    }
}

export default parsers;
