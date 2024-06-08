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
    
    // init
    if (args.init) {
        const init = await (import('#core/init'));
        info(['Init', 'YELLOW'], ['Making directories']);
        init.make_default_directory();
        info(['Init', 'YELLOW'], ['Touching templates']);
        init.make_common_file();
        return;
    }

    try{
        db.config = GObject.mix(SettingsTemplate, JSON.parse(
            readFileSync(db.proc.args['config'] || 'config.json').toString()), true);
        // Object.assign created a clone
        db.settings = new Collection(Object.assign({},db.config));
    } catch (e) {
        ErrorLogger.couldNotLoadConfig();
        return;
    }
    const argv = db.proc.args;

    info(['ENABLED FEATURES: '+(db.config.enabledFeatures??''),'WHITE']);

    db.dirs.posts = db.config.post_directory ?? db.config.build?.post_directory ?? "posts";
    db.dirs.public = db.config.public_directory ?? db.config.build?.public_directory ?? "public";
    // db.dirs.root = (!['/', '', undefined].includes(db.config.build?.root) && db.config.build?.root)||(!['/', '', undefined].includes(db.config.build?.site_root) && db.config.build.site_root)|| '';
    db.theme.dirs.root = join('_themes', argv['theme'] || db.settings.get('theme.name'));
    db.theme.dirs.extra = join(db.theme.dirs.root, 'extra');
    db.theme.dirs.layout = join(db.theme.dirs.root, 'layouts');
    db.theme.dirs.files = join(db.theme.dirs.root, 'files');
    db.dirs.theme = db.theme.dirs;

    // Feature <fewu:path/url/autoRoot>
    if(db.config.enabledFeatures?.includes('fewu:path/url/autoRoot')){
        let urlRegex = /(?:.*?:\/\/)?(?:.*?\.).*?\..*?\//;

        if(urlRegex.test(db.config.website?.URL)){
            let urlRoot = urlRegex.exec(db.config.website.URL)[0];
            let relativeUrl = db.config.website.URL.replace(urlRoot,'');
            if(relativeUrl.endsWith('/')){
                relativeUrl = relativeUrl.slice(0,-1);
            }
            info(['AUTO DETECT'],['DETECTED: '+relativeUrl+'/','WHITE']);
            db.dirs.root = relativeUrl;
        } else {
            db.dirs.root = '';
        }
    } else {
        if(db.config.build?.root &&! ['/',''].includes(db.config.build.root)){
            db.dirs.root = db.config.build.root;
        } else if(db.config.build?.site_root &&! ['/',''].includes(db.config.build.site_root)){
            db.dirs.root = db.config.build.site_root;
        } else {
            db.dirs.root = '';
        }
    }

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
    db.site = site();
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
