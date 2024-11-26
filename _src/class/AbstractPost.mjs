let regExps = {
    MATCH_H1: /\n# /
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
        const lines = content.split("\n");
        let postContent = '';
        let properties = {
            title: "Untitled",
            date: '1970-1-1',
            category: " ",
            tags: " ",
            license: 'CC BY-NC-SA 4.0'
        };
        let i = 0;
        if (lines[i] === "---") {
            i++;
            while (lines[i] !== "---") {
                let __tempor_val = lines[i].split(":");
                properties[__tempor_val.shift()] = __tempor_val.map(v => v[0] == ' ' ? v.replace(' ', '') : v).join(":");
                i++;
            }
            i++;
        }

        let moreIndex = lines.indexOf('<!--more-->');

        if (moreIndex === -1) {
            /* No foreword provided */
            postContent = lines.slice(i).join('\n');
        } else {
            postContent = lines.slice(moreIndex).join('\n');
        }
        return {
            properties,
            postContent
        };
    }

    /**
     * @type {Promise<void>}
     * @since 1.3.0
     */
    done;

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
    path = {
        website: '',
        local: ''
    }
    parsed = {
        content: '',
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
