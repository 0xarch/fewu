import { join } from 'path';
import { readFileSync, cp } from 'fs';
import { gopt, info, nexo_logo } from '#core/run.js';
import db from '#db';
import GObject from '#core/gobject.js';
import * as part from '#core/part.js';
import { write } from '#core/builder.js';
import { site, sort, get_file_relative_dir } from '#core/reader.js';
import { SettingsTemplate } from '#core/config_template.js';
import { Collection } from '#core/struct.js';
import { auto_set_i18n_file, i18n } from '#core/i18n.js';
import Layout from '../lib/class.layout.js';

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
    db.proc.args = gopt(process.argv);

    // init
    if (db.proc.args.init) {
        const init = await (import('#core/init.js'));
        info(['Init', 'YELLOW'], ['Making directories']);
        init.make_default_directory();
        info(['Init', 'YELLOW'], ['Touching templates']);
        init.make_common_file();
        return;
    }

    db.settings = new Collection(GObject.mix(SettingsTemplate, JSON.parse(
        readFileSync(db.proc.args['config'] || 'config.json').toString()), true));
    const argv = db.proc.args;
    let buildMode = argv['devel'] ? 'devel' : 'release';
    db.builder.mode = buildMode;

    info(['BUILD MODE'], [buildMode, 'GREEN']);

    db.dirs.posts = db.settings.get('build.post_directory') || "posts";
    db.dirs.public = db.settings.get('build.public_directory') || "public";
    db.dirs.root = !["/", "", undefined].includes(db.settings.get('build.root') || db.settings.get('build.site_root')) ? db.settings.get('build.site_root') : '';
    db.dirs.theme.root = join('themes', argv['theme'] || db.settings.get('theme.name'));
    db.dirs.theme.extra = join(db.dirs.theme.root, 'extra');
    db.dirs.theme.layout = join(db.dirs.theme.root, 'layouts');
    db.dirs.theme.files = join(db.dirs.theme.root, 'files');

    if (argv['only'] == 'updateTheme') {
        cp(db.dirs.theme.files, join(db.dirs.public, 'files'), { recursive: true }, () => { });
        cp('sources', join(db.dirs.public, 'sources'), { recursive: true }, () => { });
        return;
    }

    db.theme = new Collection(JSON.parse(readFileSync(join(db.dirs.theme.root, 'config.json')).toString()));

    db.builder.type = db.theme.get('layout.type');
    db.language = db.settings.get('language') || 'en-US';
    db.site = site();
    db.sort = sort(db.site.posts);
    db.file = get_file_relative_dir;
    db.modules.enabled = db.settings.get('modules.enabled');

    auto_set_i18n_file();

    let constants = (await import('#core/constants.js')).default;

    // since v2
    let Provision = {
        v2: {
            site: db.site,
            nexo: {
                logo: nexo_logo,
                deploy_time: db.proc.time,
            },
            proc: {

            },
            buildMode,
            GObject,
            ...constants
        },
        v3: {
            db,
            site: db.site,
            proc: db.proc,
            nexo: {
                logo: nexo_logo,
            }
        }
    };

    let __plugin;
    let __get_title = (function () {
        let sep = '|';
        let theme = db.settings.get('theme.title');
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

    let __provided_theme_config = GObject.mix(db.theme.get('default'), db.settings.get('theme.options'), true);

    if (db.theme.has('API')) {
        let api_conf = db.theme.get('API');
        if (api_conf.hasPlugin) {
            // used in eval
            let sec_gconf = Object.assign({}, Provision.v2.site); sec_gconf;
            let site = Object.assign({}, Provision.v2.site); site;
            let insert_code = 'let Provision = undefined;\n';
            let __plugin_file = readFileSync(join(db.dirs.theme.root, 'extra/plugin.js'));
            let __plugin_script = 'try{\n' + insert_code + __plugin_file.toString() + '\nplugin()}catch(e){errno(20202);console.error(e);"NULL"}';
            __plugin = eval(__plugin_script);
        }
    }

    db.builder.api_required = {
        Plugin: __plugin,
        posts: db.site.posts,
        excluded_posts: db.site.excluded_posts,
        sort: db.sort,
        ID: db.sort.ID,
        IDMap: db.site.ID,
        settings: db.settings.get_all(),
        theme: __provided_theme_config,
        user: db.settings.get('user'),
        nexo: {
            logo: nexo_logo,
            deploy_time: db.proc.time,
        },
        __root_directory__: db.dirs.root,
        __title__: __get_title,
        file: db.file,
        i18n,
        mix: GObject.mix,
        has_property: (...I) => GObject.hasProperty(...I),
        get_property: GObject.getProperty,
        ...Provision.v2
    };

    // Load modules
    db.modules.enabled.forEach(async (module_name) => {
        const Module = (await import('#modules/' + module_name + '.js')).default;
        if (!Module || !Module.exec) throw new Error('Could not load module:', module_name);
        Module.exec();
    })

    for (let item of db.theme.get('layout.layouts')) {
        write(new Collection({ ...db.builder.api_required }), new Layout(item));
    }

    let postFilename = join(db.dirs.theme.layout, db.theme.get('layout.post_layout'));
    db.builder.template.post = readFileSync(postFilename).toString();

    part.build_post_pages({
        basedir: db.dirs.theme.layout,
        filename: postFilename
    }, {
        ...db.builder.api_required,
        filename: postFilename
    });

    part.copy_files();
}

export default App;
