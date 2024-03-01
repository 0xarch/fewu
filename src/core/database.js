let site;
let settings;
let theme;

const database = {
    /**
     * 
     * @param {Object} site_ 
     * @returns {void}
     */
    set_site:(site_)=>site=site_,
    /**
     * 
     * @returns {Object}
     */
    get_site:()=>site,
    /**
     * 
     * @param {Collection} site_ 
     * @returns {void}
     */
    set_conf:(conf_)=>settings=conf_,
    /**
     * 
     * @returns {Collection}
     */
    get_conf:()=>settings,
    /**
     * 
     * @param {Collection} them_ 
     * @returns {void}
     */
    set_theme:(them_)=>theme=them_,
    /**
     * 
     * @returns {Collection}
     */
    get_theme:()=>theme
}

export default database;