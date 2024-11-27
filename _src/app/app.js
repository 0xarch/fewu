import database from '#database';

import { join } from 'path';
import { readFileSync, cp} from 'fs';
import db from '#db';
import Collection from '#class/collection';
import { gopt, info, fewu_logo, } from '#core/run';
import GObject from '#core/gobject';
import * as part from '#core/part';
import { site, sort, get_file_relative_dir } from '#core/reader';
import { SettingsTemplate } from '#core/config_template';
import i18n from '#core/i18n';
import ErrorLogger from '#core/error_logger';
import { loadPlugin,loadModules } from '#core/loader';

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

    info(['Enabled features: '+(db.config?.feature?.enable??''),'WHITE']);

    db.$.resolveDirectories(db.config,db);

    info(['Will build pages at: '+(db.dirs.root)+'/','WHITE']);

    // Mount on global
    global.PUBLIC_DIRECTORY = db.dirs.public;

    if (argv['only'] == 'updateTheme') {
        cp(db.theme.dirs.files, join(db.dirs.public, 'files'), { recursive: true }, () => { });
        cp('sources', join(db.dirs.public, 'sources'), { recursive: true }, () => { });
        return;
    }

    try {
        db.theme.name = argv['theme'] ?? db.config.theme?.name;
        db.theme.config = JSON.parse(readFileSync(join(db.theme.dirs.root,'theme.json')).toString());
        db.theme.settings = new Collection(Object.assign({},db.theme.config));
        db.theme.variables = JSON.parse(readFileSync(join(db.theme.dirs.root,'variables.json')).toString());
    } catch(e) {
        ErrorLogger.couldNotLoadTheme();
        return;
    }

    db.builder.mode = argv['devel'] ? 'devel' : 'release';
    db.builder.type = db.theme.config.parser;
    db.builder.parser_name = db.theme.config.parser;
    db.language = argv['language'] ?? db.config.language ?? 'en-US';
    db.site = await site();
    db.sort = sort(db.site.posts);
    db.file = get_file_relative_dir;
    db.modules.enabled = db.config.modules?.enabled instanceof Array ? db.config.modules.enabled : [];

    info(['BUILD MODE'], [db.builder.mode, 'GREEN']);

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
