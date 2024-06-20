import { join } from 'path';

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
     * @type {{
     *      posts: Post[]
     * }}
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
    feature: {
        enabled: [],
        config: {}
    },
    module: {
        enabled: [],
        config: {}
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
    constants: void 0,
    $: {
        resolveDirectories(config, db) {
            db.dirs.posts = config.postDirectory ?? config.post_directory ?? config.build?.post_directory ?? "posts";
            db.dirs.public = config.publicDirectory ?? config.public_directory ?? config.build?.public_directory ?? "public";
            
            if(!db.config.website){
                db.config.website = { URL: db.config.site_url };
            } else if (!db.config.website.URL){
                db.config.website.URL = db.config.website.url ?? db.config.site_url;
            }

            // resolve root
            if (config?.feature?.enable?.includes('fewu:path/url/autoRoot') || config?.enabledFeatures?.includes('fewu:path/url/autoRoot')) {
                let urlRegex = /(?:.*?:\/\/)?(?:.*?\.).*?\..*?\//;

                if (urlRegex.test(config.website?.URL)) {
                    let urlRoot = urlRegex.exec(config.website.URL)[0];
                    let relativeUrl = config.website.URL.replace(urlRoot, '');
                    if (relativeUrl.endsWith('/')) {
                        relativeUrl = relativeUrl.slice(0, -1);
                    }
                    db.dirs.root = relativeUrl;
                } else {
                    db.dirs.root = '';
                }
            } else {
                if (config.build?.root && !['/', ''].includes(config.build.root)) {
                    db.dirs.root = config.build.root;
                } else if (config.build?.site_root && !['/', ''].includes(config.build.site_root)) { //fallback
                    db.dirs.root = config.build.site_root;
                } else {
                    db.dirs.root = '';
                }
            }

            db.theme.dirs.root = join('_themes', args['theme'] || config.theme?.name);
            db.theme.dirs.extra = join(db.theme.dirs.root, 'extra');
            db.theme.dirs.layout = join(db.theme.dirs.root, 'layouts');
            db.theme.dirs.files = join(db.theme.dirs.root, 'files');
        },
        setFallbackValues(config, db){
            // Module
            if(config.module && !db.config?.modules){
                // Needs Impl in 1.2.5
            }
        }
    }
};

// Mount on global
global.database = db;

export default db;