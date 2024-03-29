import { Collection } from "#struct";

let db = {
    /**
     * @type {Collection}
     */
    settings: void 0,
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
         * @instead db.themes.dirs
         */
        theme: {
            root: '',
            extra: '',
            layout: '',
            files: ''
        }
    },
    modules: {
        enabled: []
    },
    builder: {
        mode: '',
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
        api_required: void 0
    },
    theme: {
        /**
         * @type {Collection}
         */
        config: void 0,
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