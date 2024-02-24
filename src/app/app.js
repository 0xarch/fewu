import { gopt } from '../modules/lib/hug.js';
import * as Optam from '../modules/lib/optam.js';
import { readFileSync, writeFile, cp, existsSync } from 'fs';
import * as Path from 'path';
import { errno, info, nexo_logo,run } from '../lib/mod.js';
import { build_and_write } from '../modules/app/builder.js';
import i18n from '../modules/i18n.js';
import { getAllPosts, sort } from '../lib/posts.js';
import { has_property,get_property, mix_object } from '../lib/base_fn.js';
import { Nil } from '../lib/closures.js';
import { generateSitemapTxt,generateSitemapXml } from '../modules/sitemap.js';
/**
 * @DOCUMENT_OF_APP
 * @argument config Configuration file for Nexo.
 * @argument theme Use specified theme.
 * 
 * **NOTE** Working in progress
 */
async function App() {
    const argv = gopt(process.argv);
    let config_raw_text = readFileSync(argv['config'] || 'config.json').toString();
    const GlobalConfig = JSON.parse(config_raw_text);
    if (!GlobalConfig.security) GlobalConfig.security = {};

    if (argv['dry-run'] == 'null') {
        return;
    }

    const ThemeName = argv['theme'] || GlobalConfig.theme.name;
    const PostDir = GlobalConfig.build.post_directory,
        ThemeDir = Path.join('themes', ThemeName),
        ThemeLayoutDir = Path.join('themes', ThemeName, 'layouts'),
        ThemeFilesDir = Path.join('themes', ThemeName, 'files'),
        PublicDir = GlobalConfig.build.public_directory;
    const ThemeConfig = JSON.parse(readFileSync(Path.join(ThemeDir, 'config.json')).toString());
    const ThemeLayoutType = ThemeConfig.layout.type;
    let language = GlobalConfig.language || 'en-US';
    let lang_file = {};
    {
        let lang_file_path = Path.join(ThemeDir, 'extra/i18n.' + language + '.json');
        if (existsSync(lang_file_path)) {
            lang_file = JSON.parse(readFileSync(lang_file_path).toString());
        }
    }

    if (!PostDir) PostDir = "posts";
    if (!PublicDir) PublicDir = "public";

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

    // deprecated, v2 ~ later
    const { Posts, Specials } = Optam.ReadPosts(PostDir, GlobalConfig.excluded_posts);
    const { posts, excluded_posts } = getAllPosts(PostDir, GlobalConfig.excluded_posts);

    const Sorts = Optam.getSort(Posts);
    const sorted_posts = sort(posts);

    // unmaintained , v2
    let provision_site = getAllPosts(PostDir, GlobalConfig.excluded_posts);

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
    /**
     * @DOCUMENT_OF_INTERNATIONALIZATION
     * @since v2
     */
    let __i18n = i18n(lang_file);

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
    let __provided_nexo = {};

    if (GlobalConfig.sitemap) {
        if (GlobalConfig.sitemap.type == 'txt') {
            writeFile(Path.join(PublicDir, GlobalConfig.sitemap.name), generateSitemapTxt(GlobalConfig.site_url, posts, ThemeConfig), Nil)
        } else {
            writeFile(Path.join(PublicDir, GlobalConfig.sitemap.name), generateSitemapXml(GlobalConfig.site_url, posts, ThemeConfig), Nil)
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
            let sec_gconf = JSON.parse(JSON.stringify(GlobalConfig)); sec_gconf;
            let site = JSON.parse(JSON.stringify(provision_site)); site;
            let insert_code = 'let provision_site = undefined;\n';
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
                let href = __get_file_relative_dir(article.websitePath);
                let atitle = article.title;
                if (title) { arr.push({ 'content': article.title, 'by': 'Title', href, atitle }); }
                if (id) { arr.push({ 'content': article.id, 'by': 'ID', href, atitle }); }
                if (content) { arr.push({ 'content': article.content.replace(/\n/g, ' ').replace('<!--more-->', ''), 'by': 'Content', href, atitle }); }
                if (date) { arr.push({ 'content': article.date.toDateString(), 'by': 'Date', href, atitle }); }
            }
            __provided_nexo.searchStringUrl = __get_file_relative_dir('searchStrings.json');
            writeFile(Path.join(PublicDir, 'searchStrings.json'), JSON.stringify(arr), () => { });
        }
    }
    /**
     * 
     * @param { string } filename 
     * @returns {object}
     */
    function resolve(filename) {
        if (ThemeConfig.API && ThemeConfig.API.provideWith && ThemeConfig.API.provideWith != "v1") {
            switch (ThemeConfig.API.provideWith) {
                case "v2":
                    return {
                        Plugin: __plugin,
                        allArticles: Posts,
                        posts,
                        excluded_posts,
                        sort: sorted_posts,
                        ID: sorted_posts.ID,
                        settings: GlobalConfig,
                        theme: __provided_theme_config,
                        user: GlobalConfig.user,
                        __root_directory__: __public_root,
                        __filename__: filename,
                        __title__: __get_title,
                        file: __get_file_relative_dir,
                        i18n: __i18n,
                        mix: mix_object,
                        has_property,
                        get_property,
                        insert_nexo_logo: nexo_logo,
                        Nexo: __provided_nexo,
                        site: provision_site
                    }
            }
        } else {
            return {
                Posts,
                Sorts,
                GlobalConfig,
                user: GlobalConfig.user,
                theme: GlobalConfig.theme.options,
                Appearance: GlobalConfig.appearance,
                ROOT: __public_root,
                ...Sorts
            }
        }
    }

    for (let item of ThemeConfig.layout.layouts) {
        let filename = Path.join(ThemeLayoutDir, item.build.filename),
            destname = Path.join(PublicDir, item.build.destname, 'index.html');
        let inconf_extra = {};
        if (item.build.extras) inconf_extra = eval('let _intpvar=' + item.build.extras + ';_intpvar');
        /**
         * @DOCUMENT_OF_VARIAS
         * @since 0.0.1
         * To Enable, set build.varias: true
         * Required configuration statements:
         *  build.option.varias: {
         *      parent: <variable name> // this must be {} (paired object)
         * }
         * 
         * Offers:
         *  Varias:{
         *      enabled: boolean, // true
         *      keyName: string, // pair key
         *      value: any, // pair value
         * }
         * 
         * Changes:
         *  destnation -> ${build.destname}/index_${Varias.keyName}.html
         */
        if (item.build.varias && item.build.option.varias) {
            let Varias = {};
            let option = item.build.option.varias;
            let parent_var = eval(option.parent);
            Varias.enabled = true;
            for (let var_name in parent_var) {
                const destSuffix = '_' + var_name;
                destname = Path.join(PublicDir, item.build.destname, 'index' + destSuffix + '.html');
                Varias.keyName = var_name;
                Varias.value = parent_var[var_name];
                const _W_vars = { Varias };
                inconf_extra['Varias'] = Varias;
                BF_with(_W_vars, item, filename, destname, inconf_extra, destSuffix);
            }
        } else
            BF_with({}, item, filename, destname, inconf_extra);
    }
    let postFilename = Path.join(ThemeLayoutDir, ThemeConfig.layout.post_layout);
    let postTemplate = readFileSync(postFilename).toString();

    part_build_page(ThemeLayoutType, postTemplate, posts, PublicDir, ThemeConfig, {
        basedir: ThemeLayoutDir,
        filename: postFilename
    }, {
        ...resolve(postFilename)
    });
    part_copyfiles(ThemeFilesDir, PublicDir, ThemeConfig);

    async function BF_with(vars, item, filename, destname, inconf_extra, destSuffix = '') {
        /**
         * Cycl-building(Cycling)
         * To Enable, set build.cycling: true
         * Required configuration statements:
         *  build.option.cycling: {
         *      parent: <variable name>, // this must be [] (Array-like) or {} (JSON)
         *      every: number // integer, slice count
         *      name: string // the name for child variable to use
         * }
         * 
         * Offers:
         *  Cycling: {
         *      enabled: boolean, // true
         *      TotalCount: number,
         *      LoopTime: number,
         *      FileLocationPrefix: string,
         *      PreviousFile: string,
         *      NextFile: string
         * }
         * 
         * Changes:
         *  destnation -> ${build.destname}/index_${Cycling.LoopTime}.html
         */
        if (item.build.cycling && item.build.option.cycling) {
            let Cycling = {};
            let option = item.build.option.cycling;
            // aro stands for "array or object"
            let father_aro = [], every = option.every;
            {
                let __splited = option.parent.split(".");
                let __root = __splited.shift();
                try{
                    __root = eval(__root);
                }catch(e){
                    __root = inconf_extra[__root];
                }
                father_aro = get_property(__root,__splited.join("."));
            }
            if (!Array.isArray(father_aro)) {
                let _arr = [];
                for (let objKey in father_aro) {
                    _arr.push({ key: objKey, value: father_aro[objKey] });
                }
                father_aro = _arr;
            }
            let len = father_aro.length;

            Cycling.enabled = true;
            Cycling.TotalCount = Math.ceil(len / every);
            for (let i = 0; i * every <= len; ++i) {
                let _destPrePath = Path.join(PublicDir, item.build.destname);
                destname = Path.join(_destPrePath, 'index' + destSuffix + '_' + (i + 1) + '.html');
                Cycling[option.name] = father_aro.slice(i * every, (i + 1) * every);
                Cycling.value = father_aro.slice(i * every, (i + 1) * every);
                Cycling.LoopTime = i + 1;
                Cycling.PreviousFile = Path.join(_destPrePath, 'index' + destSuffix + '_' + i + '.html');
                Cycling.NextFile = Path.join(_destPrePath, 'index' + destSuffix + '_' + (i + 2) + '.html');
                Cycling.FileLocationPrefix = Path.join(__public_root, item.build.destname);
                build_and_write(ThemeLayoutType, readFileSync(filename).toString(), {
                    basedir: ThemeLayoutDir,
                    filename
                }, {
                    filename,
                    ...resolve(),
                    ...inconf_extra,
                    ...vars,
                    Cycling
                }, ThemeConfig, destname);
            }
        } else
            build_and_write(ThemeLayoutType, readFileSync(filename).toString(), {
                basedir: ThemeLayoutDir,
                filename
            }, {
                filename,
                ...resolve(),
                ...inconf_extra,
                ...vars
            }, ThemeConfig, destname);
    }
}

async function part_copyfiles(themeFileDir, publicDir, ThemeConfig) {
    cp(themeFileDir, Path.join(publicDir, 'files'), { recursive: true }, () => { });
    cp('resources', Path.join(publicDir, 'resources'), { recursive: true }, () => { });
    if (ThemeConfig.rawPosts && ThemeConfig.rawPosts.copy) {
        run(()=>{
            cp('posts', Path.join(publicDir, ThemeConfig.rawPosts.copyTo), { recursive: true }, Nil);
        },9004);
    }
    if (ThemeConfig.enableThemeWebsiteIcon) {
        cp(Path.join(themeFileDir, 'extra/favicon.ico'), publicDir, () => { });
    } else {
        cp('./nexo_sources/favicon.ico', Path.join(publicDir, 'favicon.ico'), (e) => { if (e) throw e });
    }
    info(['OPERATION.COPY','MAGENTA','BOLD'],['COMPLETE','GREEN']);
}

async function part_build_page(layoutType, template, Articles, publicDir, ThemeConfig, options, GivenVariables) {
    Articles.forEach(item => {
        run(()=>{
            let destname = Path.join(publicDir, item.publicFilePath);
            info([item.publicFilePath,'MAGENTA','NONE']);
            build_and_write(layoutType, template, options, {
                post: item,
                ...GivenVariables
            }, ThemeConfig, destname);
        },9001);
    });
}

export default App;
