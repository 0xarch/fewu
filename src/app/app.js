import { gopt } from '../core/run.js';
import * as Path from 'path';
import { readFileSync, writeFile, cp } from 'fs';
import { write, proc_final as build_and_write } from '../core/builder.js';
import { site, sort } from '../core/reader.js';
import { SettingsTemplate } from '../core/config_template.js';
import db from '../core/database.js';
import GObject from '../core/gobject.js';
import CONSTANTS from '../core/constants.js';
import { Collection } from '../core/struct.js';
import Layout from '../lib/class.layout.js';
import { info, nexo_logo, run } from '../lib/mod.js';
import { i18n, set_i18n_file } from '../modules/i18n.js';
import sitemap from '../modules/sitemap.js';
/**
 * @DOCUMENT_OF_APP
 * @argument config [file] Configuration file for Nexo.
 * @argument theme [string] Use specified theme.
 * @argument init [void] WIP.
 * 
 * **NOTE** Working in progress
 */
async function App() {
    db.proc.args = gopt(process.argv);
    db.settings = new Collection(GObject.mix(SettingsTemplate, JSON.parse(
        readFileSync(db.proc.args['config'] || 'config.json').toString()), true));
    let deploy_time = new Date();
    const argv = gopt(process.argv);
    let config_raw_text = readFileSync(argv['config'] || 'config.json').toString();
    const GlobalConfig = JSON.parse(config_raw_text);
    if (!GlobalConfig.security) GlobalConfig.security = {};

    const ThemeName = argv['theme'] || db.settings.get('theme.name');

    const ThemeDir = Path.join('themes', ThemeName);
    const ThemeConfig = JSON.parse(readFileSync(Path.join(ThemeDir, 'config.json')).toString());
    const ThemeLayoutType = ThemeConfig.layout.type;

    db.theme = new Collection(JSON.parse(readFileSync(Path.join(ThemeDir, 'config.json')).toString()));

    db.dirs.posts = db.settings.get('build.post_directory') || "posts";
    db.dirs.public = db.settings.get('build.public_directory') || "public";
    db.dirs.root = !["/", "", undefined].includes(db.settings.get('build.site_root')) ? db.settings.get('build.site_root') : '';
    db.dirs.theme.root = Path.join('themes', ThemeName);
    db.dirs.theme.extra = Path.join(db.dirs.theme.root, 'extra');
    db.dirs.theme.layout = Path.join(db.dirs.theme.root, 'layouts');
    db.dirs.theme.files = Path.join(db.dirs.theme.root, 'files');

    db.language = db.settings.get('language') || 'en-US';
    db.site = site();
    db.sort = sort(db.site.posts);

    let lang_file = {};
    {
        let lang_file_path = Path.join(ThemeDir, 'extra/i18n.' + db.language + '.json');
        try {
            lang_file = JSON.parse(readFileSync(lang_file_path).toString());
        } catch (_) { }
    }

    if (argv['only'] == 'updateTheme') {
        cp(db.dirs.theme.files, Path.join(db.dirs.public, 'files'), { recursive: true }, () => { });
        cp('sources', Path.join(db.dirs.public, 'sources'), { recursive: true }, () => { });
        return;
    }

    // since v2
    let Provision = {
        v2: {
            site: db.site,
            nexo: {
                logo: nexo_logo(),
                deploy_time,
            },
            proc: {

            },
            GObject,
            ...CONSTANTS
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
     * @returns string
     * @since v2
     */
    function __get_file_relative_dir(file_dir) {
        if (!file_dir) return __public_root + '/';
        if (file_dir[0] == '/')
            file_dir = file_dir.substring(1)
        return __public_root + "/" + file_dir;
    }
    let __provided_theme_config = GObject.mix(db.theme.get('default'), db.settings.get('theme.options'));

    if (db.settings.has('sitemap')) {
        let path = Path.join(db.dirs.public, db.settings.get('sitemap.name')), type = db.settings.get('sitemap.type');
        let url = db.settings.get('site_url');
        if (type == 'txt') {
            writeFile(path, sitemap.TXT(url, db.site.posts), () => { })
        } else {
            writeFile(path, sitemap.XML(url, db.site.posts), () => { })
        }
    }
    if (GlobalConfig.extra_file) {
        for (let k of GlobalConfig.extra_file) {
            cp(Path.join('extra', k), Path.join(db.dirs.public, GlobalConfig.extra_file[k]), () => { });
        }
    }
    if (db.theme.has('API')) {
        let api_conf = db.theme.get('API');
        if (api_conf.hasPlugin) {
            // used in eval
            let sec_gconf = Object.assign({}, Provision.v2.site); sec_gconf;
            let site = Object.assign({}, Provision.v2.site); site;
            let insert_code = 'let Provision = undefined;\n';
            //if (GlobalConfig.security.allowFileSystemOperationInPlugin != true) insert_code += 'let fs = null;\n';
            //if (GlobalConfig.security.allowConfiguationChangeInPlugin != true) insert_code += `let GlobalConfig = sec_gconf;\n`;
            let __plugin_file = readFileSync(Path.join(ThemeDir, 'extra/plugin.js'));
            let __plugin_script = 'try{\n' + insert_code + __plugin_file.toString() + '\nplugin()}catch(e){errno(20202);console.error(e);"NULL"}';
            __plugin = eval(__plugin_script);
        }
        if (api_conf.searchComponent) {
            let search_config = api_conf.searchComponent;
            let arr = [];
            let title = search_config.includes('title'),
                id = search_config.includes('id'),
                content = search_config.includes('content'),
                date = search_config.includes('date');
            for (let article of db.site.posts) {
                let href = __get_file_relative_dir(article.path('website'));
                let atitle = article.title;
                if (title) { arr.push({ 'content': article.title, 'by': 'Title', href, atitle }); }
                if (id) { arr.push({ 'content': article.id, 'by': 'ID', href, atitle }); }
                if (content) { arr.push({ 'content': article.content.replace(/\n/g, ' '), 'by': 'Content', href, atitle }); }
                if (date) { arr.push({ 'content': article.date.toDateString(), 'by': 'Date', href, atitle }); }
            }
            Provision.v2.nexo.searchStringUrl = __get_file_relative_dir('searchStrings.json');
            writeFile(Path.join(db.dirs.public, 'searchStrings.json'), JSON.stringify(arr), () => { });
        }
    }
    let api_required = {
        Plugin: __plugin,
        posts,
        excluded_posts,
        sort: sorted_posts,
        ID: sorted_posts.ID,
        settings: GlobalConfig,
        theme: __provided_theme_config,
        user: db.settings.get('user'),
        __root_directory__: __public_root,
        __title__: __get_title,
        file: __get_file_relative_dir,
        i18n,
        mix: GObject.mix,
        has_property: (...I) => GObject.hasProperty(...I),
        get_property: GObject.getProperty,
        ...Provision.v2
    };

    for (let item of db.theme.get('layout.layouts')) {
        write(new Collection({ ...api_required }), new Layout(item));
    }
    let postFilename = Path.join(db.dirs.theme.layout, db.theme.get('layout.post_layout'));
    let postTemplate = readFileSync(postFilename).toString();

    part_build_page(ThemeLayoutType, postTemplate, posts, db.dirs.public, {
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
    cp(themeFileDir, Path.join(publicDir, 'files'), { recursive: true }, () => { });
    cp('resources', Path.join(publicDir, 'resources'), { recursive: true }, () => { });
    if (ThemeConfig.copy) {
        for (let key in ThemeConfig.copy) {
            if (key.charAt(0) == '@') {
                switch (key) {
                    case "@posts":
                        run(() => {
                            cp('posts', Path.join(publicDir, ThemeConfig.copy['@posts']), { recursive: true }, () => { });
                        }, 9101);
                        break;
                }
            } else {
                run(() => {
                    cp(Path.join(themeFileDir, 'extra', key), Path.join(publicDir, ThemeConfig.copy[key]), { recursive: true }, () => { });
                }, 9102);
            }
        }
    }
    if (ThemeConfig.enableThemeWebsiteIcon) {
        cp(Path.join(themeFileDir, 'extra/favicon.ico'), publicDir, () => { });
    } else {
        cp('./nexo_sources/favicon.ico', Path.join(publicDir, 'favicon.ico'), (e) => { if (e) throw e });
    }
    info(['OPERATION.COPY', 'MAGENTA', 'BOLD'], ['COMPLETE', 'GREEN']);
}

async function part_build_page(layoutType, template, Articles, publicDir, options, GivenVariables) {
    Articles.forEach(item => {
        run(() => {
            let destname = Path.join(publicDir, item.path('local'));
            info([item.title, 'MAGENTA'], [item.path('local'), 'YELLOW'], ['SUCCESS', "GREEN"]);
            build_and_write(layoutType, template, options, {
                post: item,
                ...GivenVariables
            }, destname);
        }, 9001);
    });
}

export default App;
