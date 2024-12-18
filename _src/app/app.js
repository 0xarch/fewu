import database from '#database';

import db from '#db';
import Collection from '#class/collection';
import GObject from '#core/gobject';
import * as part from '#core/part';
import { site, sort, get_file_relative_dir } from '#core/reader';
import i18n from '#core/i18n';
import { loadPlugin,loadModules } from '#core/loader';
import Console from '#util/Console';
import { value as programLogo } from '#common/logo';

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
async function App() {
    await globalThis.DATABASE_INIT_DONE;
    console.log(`Starting build..`);
    db.config = database.data.general.config;
    db.settings = new Collection(Object.assign({},db.config));

    db.$.resolveDirectories(db.config,db);

    // Mount on global
    globalThis.PUBLIC_DIRECTORY = db.dirs.public;

    database.data.builder.site = await site();
    database.data.builder.sort = sort(database.data.builder.site.posts);

    db.builder.mode = database.data.builder.mode;
    db.builder.type = database.data.theme.config.parser;
    db.builder.parser_name = database.data.theme.config.parser;
    db.language = database.data.general.lang;
    db.site = database.data.builder.site;
    db.sort = database.data.builder.sort;
    db.file = get_file_relative_dir;
    db.modules.enabled = database.data.module.enabled;

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

    const PROVISION = {
        db,
        site: database.data.builder.site,
        sort: database.data.builder.sort,
        CONSTANTS: database.data.constant,
        fewu: {
            logo: programLogo
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

    database.data.theme.mixedVariables = GObject.mix(database.data.theme.variables, database.data.general.config.theme?.options ?? database.data.general.config['theme-options'] ?? {}, true);

    // Load theme-side plugin
    db.builder.plugin = await loadPlugin(PROVISION);
    if (db.builder.plugin === null) return;

    loadModules(PROVISION);

    database.data.builder.exposedApi = {
        plugin: db.builder.plugin,
        posts: db.site.posts,
        excluded_posts: db.site.excluded_posts,
        ID: db.sort.ID,
        IDMap: db.site.ID,
        settings: database.data.general.config,
        user: database.data.user,
        __root_directory__: database.data.directory.buildRootDirectory,
        __title__: __get_title,
        file: db.file,
        i18n: i18n.i18n,
        mix: GObject.mix,
        has_property: GObject.hasProperty,
        get_property: GObject.getProperty,
        GObject,
        db,
        site: database.data.builder.site,
        sort: database.data.builder.sort,
        theme: database.data.theme.mixedVariables,
        CONSTANTS: database.data.constant,
        fewu: {
            logo: programLogo
        }
    }

    db.builder.api_required = database.data.builder.exposedApi;

    part.buildPages();

    part.buildPosts();

    part.resolveThemeOperations();
    
    part.copyFiles();
}

export default App;
