import { resolveContent } from "#lib/local/mod/post";

let regExps = {
    MATCH_H1: /\n# /,
    MATCH_IMAGE: /\!\[([^\]]*?)\]\(([^\n]+?)\)/g,
};

class AbstractPost {
    static sort(a, b) {
        return a.fuzzyDate.compareWith(b.fuzzyDate);
    }
    static hasH1(string) {
        return regExps.MATCH_H1.test(string);
    }
    /**
     * 
     * @param {string} content
     */
    static resolveContent(content){
        let result = resolveContent(content);
        return result;
    }

    /**
     * @type {Promise<void>}
     * @since 1.3.0
     */
    done;
    /**
     * @type {string}
     * @since 1.3.0
     */
    filePath;
    /**
     * @type {import("node:fs").Stats}
     * @since 1.3.0
     */
    fileStat;
    /**
     * @type {string}
     * @since 1.3.0
     */
    fileContent;
    /**
     * @type {string}
     * @since 1.3.0
     */
    postContent;
    /**
     * @type {string}
     * @since 1.3.0
     */
    postIntroduction;
    /**
     * @type {string}
     */
    author;
    /**
     * @type {string}
     */
    title;
    /**
     * @type {import("#class/license").default}
     */
    license;
    /**
     * @type {string[]}
     * @since 1.3.0
     */
    categories;
    /**
     * @type {string[]}
     */
    tags;
    /**
     * @type {Date}
     */
    date;
    /**
     * @type {import("#class/fuzzydate").default}
     */
    fuzzyDate;
    /**
     * @type {number}
     * @since 1.3.0
     */
    generalId;
    /**
     * @type {number}
     * @since 1.3.0
     */
    previousId;
    /**
     * @type {number}
     * @since 1.3.0
     */
    nextId;
    /**
     * @type {number}
     */
    wordCount;
    /**
     * @type {object}
     * @since 1.3.0
     */
    properties;
    /**
     * @type {string[]}
     */
    referencedImages = [];
    path = {
        website: '',
        local: ''
    }
    parsed = {
        content: '',
        introduction: '',
        /**
         * @deprecated use [parsed.introduction]
         */
        foreword: ''
    }

    /**
     * @deprecated use [postContent]
     */
    content = '';
    /**
     * @deprecated use [categories]
     */
    category;
    /**
     * @deprecated use [postIntroduction]
     */
    foreword = '';
    /**
     * @deprecated use [fuzzyDate]
     */
    datz;
    /**
     * non-standard API
     * @deprecated use [date.toLocaleDateString(settings.language,{dateStyle:'full'})]
     */
    ECMA262Date;
    /**
     * non-standard API
     * @deprecated use [properties.keywords]
     */
    keywords;
    /**
     * @deprecated use [fileContent]
     */
    raw_string = '';
    /**
     * @deprecated use [fileStat.ctime]
     */
    lastModifiedDate;
    /**
     * @deprecated use [properties.top]
     */
    top = false;
    /**
     * @deprecated use [generalId]
     */
    id = 0;
    /**
     * @deprecated use [previousId]
     */
    prevID;
    /**
     * @deprecated use [nextId]
     */
    nextID;
    /**
     * @deprecated useless
     */
    transformedTitle;
    /**
     * @deprecated use [properties]
     */
    property;

    constructor() { }
}

export default AbstractPost;
