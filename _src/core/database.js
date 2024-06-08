import { Collection } from "#struct";
import { readFileSync } from "fs";
import { join } from "path";

class ThemeData {
    config;
    settings;
    variables;

    /**
    * @type {{
    *  root: string,
    *  layout: string,
    *  extra: string,
    *  files: string
    * }}
    */
    dirs;

    name;

    constructor(name) {
        this.name = name;
        this.dirs.root = join('_themes', name);
        this.dirs.extra = join(this.dirs.root, 'extra');
        this.dirs.layout = join(this.dirs.root, 'layouts');
        this.dirs.files = join(this.dirs.root, 'files');

        this.config = JSON.parse(readFileSync(join(this.dirs.root,'theme.json')).toString());
        this.settings = new Collection(Object.assign({},this.config));
        this.variables = JSON.parse(readFileSync(join(this.dirs.root,'variables.json')).toString());
    }
}

class Database {
    config;
    theme;
    settings;

    /**
     * @type {{
     *  public: string,
     *  post: string,
     *  root: string,
     * }}
     */
    dirs = {};

    feature = {
        enabled,
        config,
    };
    module = {
        enabled,
        config
    };

    /**
     * 
     * @param {object} rawJson 
     */
    constructor(rawJson) {
        this.settings = new Collection(rawJson);
        this.config = rawJson;

        this.feature.enabled = rawJson.feature?.enabled ?? rawJson.enabledFeatures ?? []; // WWW CHANGE API
        this.feature.config = rawJson.feature?.config;

        this.module.enabled = rawJson.module?.enabled ?? [];
        this.module.config = rawJson?.mode.config;

        this.dirs.public = rawJson.publicDirectory ?? rawJson.public_directory ?? rawJson.build?.publicDirectory ?? rawJson.build?.public_directory ?? 'public'; //fallback
        this.dirs.post = rawJson.postDirectory ?? rawJson.post_directory ?? rawJson.build?.postDirectory ?? rawJson.build?.post_directory ?? 'post';

        // resolve root
        if (this.enabledFeatures.includes('fewu:path/url/autoRoot')) {
            let urlRegex = /(?:.*?:\/\/)?(?:.*?\.).*?\..*?\//;

            if (urlRegex.test(rawJson.website?.URL)) {
                let urlRoot = urlRegex.exec(rawJson.website.URL)[0];
                let relativeUrl = rawJson.website.URL.replace(urlRoot, '');
                if (relativeUrl.endsWith('/')) {
                    relativeUrl = relativeUrl.slice(0, -1);
                }
                info(['AUTO DETECT'], ['DETECTED: ' + relativeUrl + '/', 'WHITE']);
                this.dirs.root = relativeUrl;
            } else {
                this.dirs.root = '';
            }
        } else {
            if (rawJson.build?.root && !['/', ''].includes(rawJson.build.root)) {
                this.dirs.root = rawJson.build.root;
            } else if (rawJson.build?.site_root && !['/', ''].includes(rawJson.build.site_root)) { //fallback
                this.dirs.root = rawJson.build.site_root;
            } else {
                this.dirs.root = '';
            }
        }

        this.theme = new ThemeData(args['theme'] ?? rawJson.theme.name);
    }
}

let db = {
    /**
     * @type {Collection}
     */
    settings: void 0,
    /**
     * this is used for develop that you
     * have clear path to target var.
     * 
     * do not forget to use '?.'
     * @type {object}
     */
    config: void 0,
    /**
     * @type {object}
     */
    site: void 0,
    /**
     * @type {string}
     */
    language: void 0,
    dirs: {
        posts: "posts",
        public: "public",
        root: "/",
        /**
         * @deprecated since v2.2.6
         * @instead thiss.dirs
         */
        theme: {
            root: '',
            extra: '',
            layout: '',
            files: ''
        }
    },
    modules: {
        enabled: [],
        versions: {}
    },
    builder: {
        /**
         * @type {'devel'|'release'}
         */
        mode: 'release',
        /**
         * @deprecated use parser_name instead
         */
        type: '',
        parser_name: '',
        template: {
            post: ''
        },
        /**
         * @type {object}
         */
        api_required: void 0,
        exposed: void 0,
        plugin: void 0,
        features: []
    },
    theme: {
        /**
         * @type {object}
         */
        config: void 0,
        /**
         * @type {Collection}
         */
        settings: void 0,
        name: '',
        variables: '',
        dirs: {
            root: '',
            extra: '',
            layout: '',
            files: ''
        }
    },
    proc: {
        time: new Date()
    },
    constants: void 0
};

// Mount on global
global.database = db;

export default db;

export {
    Database
}
