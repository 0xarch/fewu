import {Collection} from "./struct.js";

let db = {
    /**
     * @type {Collection}
     */
    settings:void 0,
    /**
     * @type {Collection}
     */
    theme:void 0,
    /**
     * @type {object}
     */
    site:void 0,
    /**
     * @type {string}
     */
    language:void 0,
    dirs: {
        posts:"posts",
        public:"public",
        root: "/",
        theme: {
            root:'',
            extra:'',
            layout:'',
            files:''
        }
    },
    builder: {
        mode: '',
        type: '',
        template: {
            post: ''
        },
        /**
         * @type {object}
         */
        api_required: void 0
    },
    proc:{
        time: new Date()
    },
    constants:void 0
};
export default db;