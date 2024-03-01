import { gopt } from '../core/run.js';
import * as Optam from '../modules/lib/optam.js';
import * as Path from 'path';
import { readFileSync, writeFile, cp, existsSync } from 'fs';
import { info, nexo_logo, run } from '../lib/mod.js';
import { build_and_write } from '../modules/app/builder.js';
import { write } from '../lib/builder.js';
import { i18n, set_i18n_file } from '../modules/i18n.js';
import { has_property, get_property, mix_object } from '../lib/base_fn.js';
import { Nil } from '../lib/closures.js';
import { site,sort } from '../core/reader.js';
import sitemap from '../modules/sitemap.js';
import Collection from '../lib/class.collection.js';
import Layout from '../lib/class.layout.js';
import CONSTANTS from '../core/constants.js';
/**
 * @DOCUMENT_OF_APP
 * @argument config [file] Configuration file for Nexo.
 * @argument theme [string] Use specified theme.
 * @argument init [void] WIP.
 * 
 * **NOTE** Working in progress
 */
async function App() {
    let deploy_time = new Date();
    const argv = gopt(process.argv);
    let config_raw_text = readFileSync(argv['config'] || 'config.json').toString();
    const GlobalConfig = JSON.parse(config_raw_text);
    if (!GlobalConfig.security) GlobalConfig.security = {};

    if (argv['dry-run'] == 'null') {
        return;
    }

    const ThemeName = argv['theme'] || GlobalConfig.theme.name;
    const //PostDir = GlobalConfig.build.post_directory || "posts",
        ThemeDir = Path.join('themes', ThemeName),
        ThemeLayoutDir = Path.join('themes', ThemeName, 'layouts'),
        ThemeFilesDir = Path.join('themes', ThemeName, 'files'),
        PublicDir = GlobalConfig.build.public_directory || "public";
    const ThemeConfig = JSON.parse(readFileSync(Path.join(ThemeDir, 'config.json')).toString());
    const ThemeLayoutType = ThemeConfig.layout.type;

    const Settings = new Collection(GlobalConfig);
    const Theme = new Collection(ThemeConfig);

    const PostDir = Settings.get('build.post_directory')||"posts";

    let language = GlobalConfig.language || 'en-US';
    let lang_file = {};
    {
        let lang_file_path = Path.join(ThemeDir, 'extra/i18n.' + language + '.json');
        if (existsSync(lang_file_path)) {
            lang_file = JSON.parse(readFileSync(lang_file_path).toString());
        }
    }

    if (argv['dry-run'] == 'config') {
        console.log(JSON.stringify(GlobalConfig));
        console.log(JSON.stringify(ThemeConfig));
        return;
    }

    if (argv['only'] == 'updateTheme') {
        cp(ThemeFilesDir, Path.join(PublicDir, 'files'), { recursive: true }, Nil);
        cp('sources', Path.join(PublicDir, 'sources'), { recursive: true }, Nil);
        return;
    }

    // since v2
    let Provision = {
        v2: {
            site: site(PostDir,Settings),
            nexo: {
                logo: nexo_logo(),
                deploy_time,
            },
            proc: {

            },
            ...CONSTANTS
        }
    };

    const { posts, excluded_posts } = Provision.v2.site;
    const sorted_posts = sort(posts);

    let __public_root = !["/", "", undefined].includes(GlobalConfig.build.site_root) ? GlobalConfig.build.site_root : '';

    let __plugin;
    let __get_title = (function () {
        let sep = '|';
        if (GlobalConfig.theme.title) {
            if (GlobalConfig.theme.title.separator)
                sep = GlobalConfig.theme.title.separator;
            return (fix, type) => {
                let suffix = type;
                if (GlobalConfig.theme.title[type])
                    suffix = GlobalConfig.theme.title[type];
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
    let __provided_theme_config = mix_object(ThemeConfig.default, GlobalConfig.theme.options);

    if (GlobalConfig.sitemap) {
        let path = Path.join(PublicDir, Settings.get('sitemap.name')), type = Settings.get('sitemap.type');
        if (type == 'txt') {
            writeFile(path, sitemap.TXT(Settings.get('site_url'), posts), Nil)
        } else {
            writeFile(path, sitemap.XML(Settings.get('site_url'), posts), Nil)
        }
    }
    if (GlobalConfig.extra_file) {
        for (let k of GlobalConfig.extra_file) {
            cp(Path.join('extra', k), Path.join(PublicDir, GlobalConfig.extra_file[k]), Nil);
        }
    }
    if (ThemeConfig.API) {
        if (ThemeConfig.API.hasPlugin) {
            // used in eval
            let sec_gconf = Object.assign({}, Provision.v2.site); sec_gconf;
            let site = Object.assign({}, Provision.v2.site); site;
            let insert_code = 'let Provision = undefined;\n';
            if (GlobalConfig.security.allowFileSystemOperationInPlugin != true) insert_code += 'let fs = null;\n';
            if (GlobalConfig.security.allowConfiguationChangeInPlugin != true) insert_code += `let GlobalConfig = sec_gconf;\n`;
            let __plugin_file = readFileSync(Path.join(ThemeDir, 'extra/plugin.js'));
            let __plugin_script = 'try{\n' + insert_code + __plugin_file.toString() + '\nplugin()}catch(e){errno(20202);console.error(e);"NULL"}';
            __plugin = eval(__plugin_script);
        }
        if (ThemeConfig.API.searchComponent) {
            let search_config = ThemeConfig.API.searchComponent;
            let arr = [];
            let title = search_config.includes('title'),
                id = search_config.includes('id'),
                content = search_config.includes('content'),
                date = search_config.includes('date');
            for (let article of posts) {
                let href = __get_file_relative_dir(article.path('website'));
                let atitle = article.title;
                if (title) { arr.push({ 'content': article.title, 'by': 'Title', href, atitle }); }
                if (id) { arr.push({ 'content': article.id, 'by': 'ID', href, atitle }); }
                if (content) { arr.push({ 'content': article.content.replace(/\n/g, ' '), 'by': 'Content', href, atitle }); }
                if (date) { arr.push({ 'content': article.date.toDateString(), 'by': 'Date', href, atitle }); }
            }
            Provision.v2.nexo.searchStringUrl = __get_file_relative_dir('searchStrings.json');
            writeFile(Path.join(PublicDir, 'searchStrings.json'), JSON.stringify(arr), () => { });
        }
    }
    let api_required = (function () {
        let use_api_version = "v2";
        // _______ GET API VERSION _______
        if (ThemeConfig.API && ThemeConfig.API.version) {
            if (ThemeConfig.API.version != "latest" &&
                ["v1", "v2", "v3"].includes(ThemeConfig.API.version)) {
                use_api_version = ThemeConfig.API.version;
            }
        }
        // _______ RETURN VARIABLES _______
        let json = {};
        switch (use_api_version) {
            case "v1":
                // deprecated, v2 ~ later
                const { Posts, Specials } = Optam.ReadPosts(PostDir, GlobalConfig.excluded_posts);
                const Sorts = Optam.getSort(Posts);
                json = mix_object(json, {
                    Posts,
                    Specials,
                    Sorts,
                    GlobalConfig,
                    user: GlobalConfig.user,
                    theme: GlobalConfig.theme.options,
                    Appearance: GlobalConfig.appearance,
                    ROOT: __public_root,
                    ...Sorts
                }, true);
                break;
            case "v2":
                json = mix_object(json, {
                    Plugin: __plugin,
                    posts,
                    excluded_posts,
                    sort: sorted_posts,
                    ID: sorted_posts.ID,
                    settings: GlobalConfig,
                    theme: __provided_theme_config,
                    user: GlobalConfig.user,
                    __root_directory__: __public_root,
                    __title__: __get_title,
                    file: __get_file_relative_dir,
                    i18n,
                    mix: mix_object,
                    has_property,
                    get_property,
                    insert_nexo_logo: nexo_logo,
                    ...Provision.v2
                }, true);
                break;
        }
        return json;
    })();

    for (let item of ThemeConfig.layout.layouts) {
        write(Theme, Settings, new Collection({ ...api_required }), new Layout(item));
    }
    let postFilename = Path.join(ThemeLayoutDir, ThemeConfig.layout.post_layout);
    let postTemplate = readFileSync(postFilename).toString();

    part_build_page(ThemeLayoutType, postTemplate, posts, PublicDir, ThemeConfig, {
        basedir: ThemeLayoutDir,
        filename: postFilename
    }, {
        ...api_required,
        filename: postFilename
    });
    part_copyfiles(ThemeFilesDir, PublicDir, ThemeConfig);
}

async function part_copyfiles(themeFileDir, publicDir, ThemeConfig) {
    cp(themeFileDir, Path.join(publicDir, 'files'), { recursive: true }, () => { });
    cp('resources', Path.join(publicDir, 'resources'), { recursive: true }, () => { });
    if (ThemeConfig.copy) {
        for (let key in ThemeConfig.copy) {
            if (key.charAt(0) == '@') {
                switch (key) {
                    case "@posts":
                        run(() => {
                            cp('posts', Path.join(publicDir, ThemeConfig.copy['@posts']), { recursive: true }, Nil);
                        }, 9101);
                        break;
                }
            } else {
                run(() => {
                    cp(Path.join(themeFileDir, 'extra', key), Path.join(publicDir, ThemeConfig.copy[key]), { recursive: true }, Nil);
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

async function part_build_page(layoutType, template, Articles, publicDir, ThemeConfig, options, GivenVariables) {
    Articles.forEach(item => {
        run(() => {
            let destname = Path.join(publicDir, item.path('local'));
            info([item.title, 'MAGENTA'], [item.path('local'), 'YELLOW'], ['SUCCESS', "GREEN"]);
            build_and_write(layoutType, template, options, {
                post: item,
                ...GivenVariables
            }, ThemeConfig, destname);
        }, 9001);
    });
}

export default App;
