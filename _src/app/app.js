import database from '#database';

import i18n from '#core/i18n';
import * as part from '#core/part';
import { site, sort, get_file_relative_dir } from '#core/reader';
import { loadPlugin,loadModules } from '#core/loader';
import Console from '#util-ts/Console';
import GObject from '#util/GObject';
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
    // db.config = database.data.general.config;

    // Mount on global
    globalThis.PUBLIC_DIRECTORY = database.data.directory.publicDirectory;

    database.data.builder.site = await site();
    database.data.builder.sort = sort(database.data.builder.site.posts);

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

    const PROVISION = {
        db: {
            config: database.data.general.config
        },
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
        let theme = database.data.general.config.theme;
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
    database.data.builder.plugin = await loadPlugin(PROVISION);
    if (database.data.builder.plugin === null) return;

    loadModules(PROVISION);

    database.data.builder.exposedApi = {
        plugin: database.data.builder.plugin,
        posts: database.data.builder.site.posts,
        excluded_posts: database.data.builder.site.excluded_posts,
        ID: database.data.builder.sort.ID,
        IDMap: database.data.builder.site.ID,
        settings: database.data.general.config,
        user: database.data.user,
        __root_directory__: database.data.directory.buildRootDirectory,
        __title__: __get_title,
        file: get_file_relative_dir,
        i18n: (k) => i18n.translate(k),
        mix: GObject.mix,
        has_property: GObject.hasProperty,
        get_property: GObject.getProperty,
        GObject,
        db: {
            config: database.data.general.config
        },
        site: database.data.builder.site,
        sort: database.data.builder.sort,
        theme: database.data.theme.mixedVariables,
        CONSTANTS: database.data.constant,
        fewu: {
            logo: programLogo
        }
    }

    // db.builder.api_required = database.data.builder.exposedApi;

    part.buildPages();

    part.buildPosts();

    part.resolveThemeOperations();
    
    part.copyFiles();
}

export default App;
