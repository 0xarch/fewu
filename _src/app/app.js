import { join } from 'path';
import { readFileSync, cp } from 'fs';
import db from '#db';
import { gopt, info, nexo_logo } from '#core/run';
import GObject from '#core/gobject';
import * as part from '#core/part';
import { write } from '#core/builder';
import { site, sort, get_file_relative_dir } from '#core/reader';
import { SettingsTemplate } from '#core/config_template';
import { Collection, Layout } from '#struct';
import { auto_set_i18n_file, i18n } from '#core/i18n';

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
    db.proc.args = gopt(override_argv || process.argv);

    // init
    if (db.proc.args.init) {
        const init = await (import('#core/init'));
        info(['Init', 'YELLOW'], ['Making directories']);
        init.make_default_directory();
        info(['Init', 'YELLOW'], ['Touching templates']);
        init.make_common_file();
        return;
    }

    db.settings = new Collection(GObject.mix(SettingsTemplate, JSON.parse(
        readFileSync(db.proc.args['config'] || 'config.json').toString()), true));
    const argv = db.proc.args;
    db.builder.mode = argv['devel'] ? 'devel' : 'release';

    info(['BUILD MODE'], [db.builder.mode, 'GREEN']);

    db.dirs.posts = db.settings.get('build.post_directory') || "posts";
    db.dirs.public = db.settings.get('build.public_directory') || "public";
    db.dirs.root = !["/", "", undefined].includes(db.settings.get('build.root') || db.settings.get('build.site_root')) ? db.settings.get('build.site_root') : '';
    db.theme.dirs.root = join('_themes', argv['theme'] || db.settings.get('theme.name'));
    db.theme.dirs.extra = join(db.theme.dirs.root, 'extra');
    db.theme.dirs.layout = join(db.theme.dirs.root, 'layouts');
    db.theme.dirs.files = join(db.theme.dirs.root, 'files');
    db.dirs.theme = db.theme.dirs;

    if (argv['only'] == 'updateTheme') {
        cp(db.theme.dirs.files, join(db.dirs.public, 'files'), { recursive: true }, () => { });
        cp('sources', join(db.dirs.public, 'sources'), { recursive: true }, () => { });
        return;
    }

    try {
        db.theme.name = argv['theme'] || db.settings.get('theme.name');
        db.theme.config = new Collection(JSON.parse(readFileSync(join(db.theme.dirs.root,'theme.json')).toString()));
        db.theme.variables = JSON.parse(readFileSync(join(db.theme.dirs.root,'variables.json')).toString());
    } catch(e) {
        console.error('Error reading theme configuration files. Make sure you have theme installed in _themes directory');
        return;
    }

    db.builder.type = db.theme.config.get('layout.type');
    db.language = db.settings.get('language') || 'en-US';
    db.site = site();
    db.sort = sort(db.site.posts);
    db.file = get_file_relative_dir;
    db.modules.enabled = db.settings.get('modules.enabled');

    auto_set_i18n_file();

    let constants = (await import('#core/constants')).default;

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
            buildMode: db.builder.mode,
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

    let provided_theme_plugin;
    let provided_theme_config = GObject.mix(db.theme.variables, db.settings.get('theme.options'), true);

    // plugin
    if (db.theme.config.get('plugin') == true) {
        let sec_gconf = Object.assign({}, Provision.v2.site); sec_gconf;
        let site = Object.assign({}, Provision.v2.site); site;
        let insert_code = 'let Provision = undefined;\n';
        let __plugin_file = readFileSync(join(db.theme.dirs.extra, 'plugin.js'));
        let __plugin_script = 'try{\n' + insert_code + __plugin_file.toString() + '\nplugin()}catch(e){errno(20202);console.error(e);"NULL"}';
        provided_theme_plugin = eval(__plugin_script);
    } else {
        provided_theme_plugin = {};
    }

    db.builder.api_required = {
        Plugin: provided_theme_plugin,
        posts: db.site.posts,
        excluded_posts: db.site.excluded_posts,
        sort: db.sort,
        ID: db.sort.ID,
        IDMap: db.site.ID,
        settings: db.settings.get_all(),
        theme: provided_theme_config,
        plugin: provided_theme_plugin,
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

    for (let item of db.theme.config.get('layouts')) {
        write(new Collection({ ...db.builder.api_required }), new Layout(item));
    }

    let postFilename = join(db.theme.dirs.layout, db.theme.config.get('template'));
    db.builder.template.post = readFileSync(postFilename).toString();

    part.build_post_pages({
        basedir: db.theme.dirs.layout,
        filename: postFilename
    }, {
        ...db.builder.api_required,
        filename: postFilename
    });

    part.theme_operations();
    part.copy_files();
}

export default App;
