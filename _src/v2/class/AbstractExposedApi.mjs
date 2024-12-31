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

    plugin;
    posts;
    excluded_posts;
    ID;
    IDMap;
    settings;
    user;
    __root_directory__;
    __title__;
    file;
    i18n;
    mix;
    has_property;
    get_property;
    GObject;
    db;
    sort;
    CONSTANTS;
    fewu;

    constructor(){}
}

export default AbstractExposedApi;