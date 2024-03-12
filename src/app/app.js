import { gopt } from '../core/run.js';
import { join } from 'path';
import { readFileSync, writeFile, cp } from 'fs';
import { write, proc_final as build_and_write } from '../core/builder.js';
import { site, sort } from '../core/reader.js';
import { SettingsTemplate } from '../core/config_template.js';
import db from '../core/database.js';
import GObject from '../core/gobject.js';
//import CONSTANTS from '../core/constants.js';
import { Collection } from '../core/struct.js';
import Layout from '../lib/class.layout.js';
import { info, nexo_logo, run } from '../lib/mod.js';
import { i18n, set_i18n_file } from '../modules/i18n.js';
import sitemap from '../modules/sitemap.js';
import generateSearchStrings from '../modules/search.js';
/**
 * @DOCUMENT_OF_APP
 * @argument config [file] Configuration file for Nexo.
 * @argument theme [string] Use specified theme.
 * @argument init [void] WIP.
 * @argument release build as release mode (for theme, **DEFAULT**)
 * @argument devel build as developer mode (for theme)
 * 
 * **NOTE** Working in progress
 */
async function App() {
    db.proc.args = gopt(process.argv);
    db.settings = new Collection(GObject.mix(SettingsTemplate, JSON.parse(
        readFileSync(db.proc.args['config'] || 'config.json').toString()), true));
    let deploy_time = db.proc.time;
    const argv = gopt(process.argv);
    let buildMode = argv['devel']?'devel':'release';
    db.builder.mode = buildMode;

    info(['BUILD MODE'],[buildMode,'GREEN']);

    db.dirs.posts = db.settings.get('build.post_directory') || "posts";
    db.dirs.public = db.settings.get('build.public_directory') || "public";
    db.dirs.root = !["/", "", undefined].includes(db.settings.get('build.site_root')) ? db.settings.get('build.site_root') : '';
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

    let lang_file = {};
    {
        let lang_file_path = join(db.dirs.theme.root, 'extra/i18n.' + db.language + '.json');
        try {
            lang_file = JSON.parse(readFileSync(lang_file_path).toString());
        } catch (_) { }
    }

    let constants = (await import('../core/constants.js')).default;

    // since v2
    let Provision = {
        v2: {
            site: db.site,
            nexo: {
                logo: nexo_logo,
                deploy_time,
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

    const { posts, excluded_posts } = db.site;
    const sorted_posts = db.sort;

    let __public_root = !["/", "", undefined].includes(db.settings.get('build.site_root')) ? db.settings.get('build.site_root') : '';

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

    set_i18n_file(lang_file);

    /**
     * @param { string } file_dir 
     * @returns {string}
     * @since v2
     */
    function __get_file_relative_dir(file_dir) {
        if (!file_dir) return __public_root + '/';
        if (file_dir[0] == '/')
            file_dir = file_dir.substring(1)
        return join(db.dirs.root,'/',file_dir);
    }
    db.file = __get_file_relative_dir;
    let __provided_theme_config = GObject.mix(db.theme.get('default'), db.settings.get('theme.options'),true);

    if (db.settings.has('sitemap')) {
        let path = join(db.dirs.public, db.settings.get('sitemap.name')), type = db.settings.get('sitemap.type');
        let url = db.settings.get('site_url');
        if (type == 'txt') {
            writeFile(path, sitemap.TXT(url, db.site.posts), () => { })
        } else {
            writeFile(path, sitemap.XML(url, db.site.posts), () => { })
        }
    }
    if (db.settings.has('extra_files')) {
        let extra_file = db.settings.get('extra_files');
        for (let k in extra_file) {
            cp(join('extra', k), join(db.dirs.public, extra_file[k]), () => { });
        }
    }
    Provision.v2.nexo.searchStringUrl = db.file('searchStrings.json');
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
        generateSearchStrings();
    }
    let api_required = {
        Plugin: __plugin,
        posts,
        excluded_posts,
        sort: sorted_posts,
        ID: sorted_posts.ID,
        settings: db.settings.get_all(),
        theme: __provided_theme_config,
        user: db.settings.get('user'),
        __root_directory__: __public_root,
        __title__: __get_title,
        file: db.file,
        i18n,
        mix: GObject.mix,
        has_property: (...I) => GObject.hasProperty(...I),
        get_property: GObject.getProperty,
        ...Provision.v2
    };

    for (let item of db.theme.get('layout.layouts')) {
        write(new Collection({ ...api_required }), new Layout(item));
    }
    let postFilename = join(db.dirs.theme.layout, db.theme.get('layout.post_layout'));
    db.builder.template.post = readFileSync(postFilename).toString();

    part_build_page({
        basedir: db.dirs.theme.layout,
        filename: postFilename
    }, {
        ...api_required,
        filename: postFilename
    });
    part_copyfiles();
}

async function part_copyfiles() {
    let ThemeConfig = db.theme.get_all();
    let publicDir = db.dirs.public;
    let themeFileDir = db.dirs.theme.files;
    cp(themeFileDir, join(publicDir, 'files'), { recursive: true }, () => { });
    cp('resources', join(publicDir, 'resources'), { recursive: true }, () => { });
    if (ThemeConfig.copy) {
        for (let key in ThemeConfig.copy) {
            if (key.charAt(0) == '@') {
                switch (key) {
                    case "@posts":
                        run(() => {
                            cp('posts', join(publicDir, ThemeConfig.copy['@posts']), { recursive: true }, () => { });
                        }, 9101);
                        break;
                }
            } else {
                run(() => {
                    cp(join(themeFileDir, 'extra', key), join(publicDir, ThemeConfig.copy[key]), { recursive: true }, () => { });
                }, 9102);
            }
        }
    }
    if (ThemeConfig.enableThemeWebsiteIcon) {
        cp(join(themeFileDir, 'extra/favicon.ico'), publicDir, () => { });
    } else {
        cp('./nexo_sources/favicon.ico', join(publicDir, 'favicon.ico'), (e) => { if (e) throw e });
    }
    info(['OPERATION.COPY', 'MAGENTA', 'BOLD'], ['COMPLETE', 'GREEN']);
}

async function part_build_page(options, GivenVariables) {
    const layoutType = db.builder.type;
    const template = db.builder.template.post;
    db.site.posts.forEach(async item => {
        let destname = join(db.dirs.public, item.path('local'));
        build_and_write(layoutType, template, options, {
            post: item,
            ...GivenVariables
        }, destname);
        info([item.title, 'MAGENTA'], [destname, 'YELLOW'], ['SUCCESS', "GREEN"]);
    });
}

export default App;
