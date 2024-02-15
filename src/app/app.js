import * as Hail from '../modules/lib/hail.js';
import * as Hug from '../modules/lib/hug.js';
import * as Optam from '../modules/lib/optam.js';
import * as fs from 'fs';
import * as Path from 'path';
import { errno, nexo_logo } from '../lib/mod.js';
import { build_and_write } from '../modules/app/builder.js';
import i18n from '../modules/i18n.js';
import { getAllArticles } from '../lib/article.js';
/**
 * @DOCUMENT_OF_APP
 * @argument config Configuration file for Nexo.
 * @argument theme Use specified theme.
 * 
 * **NOTE** Working in progress
 */
async function App() {
    const argv = Hug.gopt(process.argv);
    let config_raw_text = fs.readFileSync(argv['config'] || 'config.json').toString();
    const GlobalConfig = JSON.parse(config_raw_text);

    if (argv['dry-run'] == 'null') {
        return;
    }

    const ThemeName = argv['theme'] || GlobalConfig.theme.name;
    const PostDir = GlobalConfig.build.post_directory,
        ThemeDir = Path.join('themes', ThemeName),
        ThemeLayoutDir = Path.join('themes', ThemeName, 'layouts'),
        ThemeFilesDir = Path.join('themes', ThemeName, 'files'),
        PublicDir = GlobalConfig.build.public_directory;
    const ThemeConfig = JSON.parse(Hail.readFile(ThemeDir, 'config.json'));
    const ThemeLayoutType = ThemeConfig.layout.type;
    let language = GlobalConfig.language || 'en-US';
    let lang_file = {};
    {
        let lang_file_path = Path.join(ThemeDir, 'extra/i18n.' + language + '.json');
        if (fs.existsSync(lang_file_path)) {
            lang_file = JSON.parse(fs.readFileSync(lang_file_path).toString());
        }
    }

    if (!PostDir) PostDir = "posts";
    if (!PublicDir) PublicDir = "public";

    if (argv['dry-run'] == 'config') {
        console.log(JSON.stringify(GlobalConfig));
        Hug.nextline();
        console.log(JSON.stringify(ThemeConfig));
        return;
    }

    if (argv['only'] == 'updateTheme') {
        fs.cp(ThemeFilesDir, Path.join(PublicDir, 'files'), { recursive: true }, () => { });
        fs.cp('sources', Path.join(PublicDir, 'sources'), { recursive: true }, () => { });
        return;
    }

    const { Posts, Specials } = Optam.ReadPosts(PostDir, GlobalConfig.excluded_posts);
    const { articles: Articles, excluded: ExcludedArticles } = getAllArticles(PostDir, GlobalConfig.excluded_articles);
    const Sorts = Optam.getSort(Posts);

    let __public_root = !["/", "", undefined].includes(GlobalConfig.build.site_root) ? GlobalConfig.build.site_root : '';

    const BuildVariables = {
        Posts,
        Sorts,
        GlobalConfig,
        user: GlobalConfig.user,
        theme: GlobalConfig.theme.options,
        Appearance: GlobalConfig.appearance,
        ROOT: __public_root
    }

    /**
     * @DOCUMENT_OF_PLUGIN
     * set %ThemeConfig.API.hasPlugin% to true to enable plugin
     * The plugin must be located at% Theme%/extra/plugin.js 
     * and provide a plugin() method. 
     * The App will call the plugin() method
     * and pass the result to the template with the name 'Plugin'
     * @since API.v2
     * @name Plugin (v2)
     * @type object
     * @example const plugin = () => '000' ; EJS'<%=Plugin-%>' ~> 000
     */
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
     */
    function __get_file_relative_dir(file_dir) {
        if (!file_dir) return __public_root + '/';
        if (file_dir[0] == '/')
            file_dir = file_dir.substring(1)
        return __public_root + "/" + file_dir;
    }
    function __mix_object(primary, secondary, insert_new_key = false) {
        let main = primary;
        for (let key in secondary) {
            if (main.hasOwnProperty(key) || insert_new_key) {
                main[key] = secondary[key];
            }
        }
        return main;
    }
    function __has_property(object, property_path) {
        let path = property_path.split(".");
        let __tempor_val = object;
        let result = true;
        for (let i = 0; i < path.length; i++) {
            if (!__tempor_val[path[i]]) {
                result = false;
                break;
            } else __tempor_val = __tempor_val[path[i]];
        }
        return result;
    }
    let __provided_theme_config = __mix_object(ThemeConfig.default, GlobalConfig.theme.options);
    let __provided_nexo = {};

    if (ThemeConfig.API) {
        if (ThemeConfig.API.hasPlugin) {
            let __plugin_file = fs.readFileSync(Path.join(ThemeDir, 'extra/plugin.js'));
            let __plugin_script = 'try{\n' + __plugin_file.toString() + '\nplugin()}catch(e){errno(20202);console.error(e);"NULL"}';
            __plugin = eval(__plugin_script);
        }
        if (ThemeConfig.API.searchComponent) {
            let search_config = ThemeConfig.API.searchComponent;
            let arr = [];
            let title = search_config.includes('title'),
            id = search_config.includes('id'),
            content = search_config.includes('content'),
            date = search_config.includes('date');
            for (let article of Articles) {
                let href = __get_file_relative_dir(article.websitePath);
                let atitle = article.title;
                if (title) {arr.push({'content': article.title,'by': 'Title',href,atitle});}
                if (id) {arr.push({'content': article.id,'by': 'ID',href,atitle});}
                if (content) {arr.push({'content': article.content.replace(/\n/g,' ').replace('<!--more-->',''),'by': 'Content',href,atitle});}
                if (date) {arr.push({'content': article.date.toDateString(),'by': 'Date',href,atitle});}
                __provided_nexo.searchStringUrl = __get_file_relative_dir('searchStrings.json');
                fs.writeFile(Path.join(PublicDir, 'searchStrings.json'), JSON.stringify(arr),()=>{});
            }
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
                        Articles,
                        ExcludedArticles,
                        sortArticle: Sorts,
                        ID: Sorts.BID,
                        settings: GlobalConfig,
                        theme: __provided_theme_config,
                        user: GlobalConfig.user,
                        __root_directory__: __public_root,
                        __filename__: filename,
                        __title__: __get_title,
                        file: __get_file_relative_dir,
                        i18n: __i18n,
                        mix: __mix_object,
                        has_property: __has_property,
                        insert_nexo_logo: nexo_logo,
                        Nexo: __provided_nexo
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
         * Varia-building(Varias)
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
    let postTemplate = fs.readFileSync(postFilename).toString();

    part_build_page(ThemeLayoutType, postTemplate, Articles, PublicDir, ThemeConfig, {
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
            (function () {
                let __splited = option.parent.split(".");
                if (__splited.length == 1) father_aro = eval(__splited[0]);
                else {
                    let __tempor_val;
                    try {
                        __tempor_val = eval(__splited[0]);
                    } catch (_) {
                        try {
                            __tempor_val = inconf_extra[__splited[0]];
                        } catch (_) {
                            errno('30001');
                        }
                    }
                    for (let z = 1; z < __splited.length; z++) {
                        __tempor_val = __tempor_val[__splited[z]];
                    }
                    father_aro = __tempor_val;
                }
            }());
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
                Cycling.FileLocationPrefix = Path.join(BuildVariables.ROOT, item.build.destname);
                build_and_write(ThemeLayoutType, Hail.readFile(filename), {
                    basedir: ThemeLayoutDir,
                    filename
                }, {
                    ...resolve(),
                    ...inconf_extra,
                    ...vars,
                    Cycling
                }, ThemeConfig, destname);
            }
        } else
            build_and_write(ThemeLayoutType, fs.readFileSync(filename).toString(), {
                basedir: ThemeLayoutDir,
                filename
            }, {
                ...resolve(),
                ...inconf_extra,
                ...vars
            }, ThemeConfig, destname);
    }
}

async function part_copyfiles(themeFileDir, publicDir, ThemeConfig) {
    fs.cp(themeFileDir, Path.join(publicDir, 'files'), { recursive: true }, () => { });
    fs.cp('sources', Path.join(publicDir, 'sources'), { recursive: true }, () => { });
    if (ThemeConfig.rawPosts && ThemeConfig.rawPosts.copy) {
        if (ThemeConfig.rawPosts.copyTo) {
            fs.cp('posts', Path.join(publicDir, ThemeConfig.rawPosts.copyTo), { recursive: true }, () => { });
        } else {
            errno('20101');
        }
    }
    if (ThemeConfig.enableThemeWebsiteIcon){
        fs.cp(Path.join(themeFileDir,'extra/favicon.ico'),publicDir,()=>{});
    } else {
        fs.cp('./nexo_sources/favicon.ico',Path.join(publicDir,'favicon.ico'),(e)=>{if(e)throw e});
    }
    console.log('Copy Complete');
}

async function part_build_page(layoutType, template, Articles, publicDir, ThemeConfig, options, GivenVariables) {
    Articles.forEach(item => {
        try {
            let getArticle = () => item;
            let destname = Path.join(publicDir, item.publicFilePath);
            build_and_write(layoutType, template, options, {
                getArticle,
                ...GivenVariables
            }, ThemeConfig, destname);
        } catch (e) {
            console.error(e);
        }
    })
}

export default App;
