import SiteApi from "./Api/Site.mjs";

class AbstractExposedApi {

    /**
     * @type {SiteApi}
     */
    site;

    /**
     * @type {PageApi}
     */
    page;

    /**
     * @type {object}
     */
    config;

    /**
     * @type {object}
     */
    theme;

    /**
     * @type {string}
     */
    path;

    /**
     * @type {string}
     */
    url;

    constructor(){}
}

export default AbstractExposedApi;