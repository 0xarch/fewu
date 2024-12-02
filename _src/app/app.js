import database from '#database';

import { join } from 'path';
import { cp } from 'fs';
import db from '#db';
import Collection from '#class/collection';
import { gopt, fewu_logo, } from '#core/run';
import GObject from '#core/gobject';
import * as part from '#core/part';
import { site, sort, get_file_relative_dir } from '#core/reader';
import i18n from '#core/i18n';
import { loadPlugin,loadModules } from '#core/loader';
import Console from '#util/Console';

/**
 * @DOCUMENT_OF_APP
 * @argument config [file] Configuration file for Nexo.
 * @argument theme [string] Use specified theme.
 * @argument init [void] Use init module
 * @argument release [void] build as release mode (for theme, **DEFAULT**)
 * @argument devel [void] build as developer mode (for theme)
 * 
 * **NOTE** Working in progress
 */
async function App(override_argv) {
    // mount
    global.args = override_argv || gopt(process.argv);


    db.proc.args = args;

    await database.initDone();
    db.config = database.data.general.config;
    db.settings = new Collection(Object.assign({},db.config));

    const argv = db.proc.args;

    db.$.resolveDirectories(db.config,db);

    // Mount on global
    global.PUBLIC_DIRECTORY = db.dirs.public;

    if (argv['only'] == 'updateTheme') {
        cp(db.theme.dirs.files, join(db.dirs.public, 'files'), { recursive: true }, () => { });
        cp('sources', join(db.dirs.public, 'sources'), { recursive: true }, () => { });
        return;
    }

    database.data.builder.site = await site();
    database.data.builder.sort = sort(database.data.builder.site.posts);

    db.theme.name = database.data.theme.name;
    db.theme.config = database.data.theme.config;
    db.theme.settings = new Collection(Object.assign({},database.data.theme.config));
    db.theme.variables = database.data.theme.variables;


    db.builder.mode = argv['devel'] ? 'devel' : 'release';
    db.builder.type = db.theme.config.parser;
    db.builder.parser_name = db.theme.config.parser;
    db.language = argv['language'] ?? db.config.language ?? 'en-US';
    db.site = database.data.builder.site;
    db.sort = database.data.builder.sort;
    db.file = get_file_relative_dir;
    db.modules.enabled = db.config.modules?.enabled instanceof Array ? db.config.modules.enabled : [];

    Console.info('[App] Build mode is ',{
        color: 'GREEN',
        msg: database.data.builder.mode
    },' .');
    Console.info('[App] Target directory is ',{
        color: 'GREEN',
        msg: database.data.directory.buildRootDirectory
    },' .');
    Console.info('[App] Enabled features: ',{
        color: 'MAGENTA',
        msg: database.data.feature.enabled.join(", ")
    },' .');

    i18n.autoSetFile();

    db.constants = (await import('#core/constants')).default;

    const PROVISION = {
        db,
        site: db.site,
        proc: db.proc,
        CONSTANTS: db.constants,
        fewu: {
            logo: fewu_logo,
        },
        GObject,
    }

    let __get_title = (function () {
        let sep = '|';
        let theme = db.config.theme?.title;
        if (theme) {
            if (theme.separator)
                sep = theme.separator;
            return (fix, type) => {
                let suffix = type;
                if (theme[type])
                    suffix = theme[type];
                return fix + ' ' + sep + ' ' + suffix;
            }
        }
        return (fix, type) => {
            return fix + ' ' + sep + ' ' + type;
        }
    })();

    let provided_theme_config = GObject.mix(db.theme.variables, db.config.theme?.options ?? {}, true);

    // Load theme-side plugin
    db.builder.plugin = await loadPlugin(PROVISION);
    if (db.builder.plugin === null) return;

    loadModules(PROVISION);

    db.builder.api_required = {
        Plugin: db.builder.plugin,
        plugin: db.builder.plugin,
        posts: db.site.posts,
        excluded_posts: db.site.excluded_posts,
        sort: db.sort,
        ID: db.sort.ID,
        IDMap: db.site.ID,
        settings: db.config,
        theme: provided_theme_config,
        user: db.config.user,
        __root_directory__: db.dirs.root,
        __title__: __get_title,
        file: db.file,
        i18n: i18n.i18n,
        mix: GObject.mix,
        has_property: (...I) => GObject.hasProperty(...I),
        get_property: GObject.getProperty,
        ...PROVISION
    };

    part.buildPages();

    part.buildPosts();

    part.resolveThemeOperations();
    
    part.copyFiles();
}

export default App;
