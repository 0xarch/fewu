import { parse } from "marked";
import { minify } from "html-minifier";
import { statSync, readFileSync } from 'fs';
import { Collection, GString } from './struct.js';
import { word_count } from "./text_process.js";
import { warn } from "./run.js";
import db from "#db";

class Template {
    type;
    text;
    basedir;
    filename;
    constructor(type, text, { basedir, filename }) {
        this.type = type;
        this.text = text;
        this.basedir = basedir;
        this.filename = filename;
    }
    get_base() {
        return {
            basedir: this.basedir,
            filename: this.filename
        }
    }
}

class License {
    #CreativeCommons = {
        BY: false,
        NC: false,
        ND: false,
        SA: false,
        CC0: false,
    }
    #isCreativeCommons = true;
    /**
     * 
     * @param {string} str 
     */
    constructor(str) {
        str = str.toLowerCase();
        if (str.includes('private')) this.#isCreativeCommons = false;
        else {
            for (let k in this.#CreativeCommons) {
                if (str.includes(k.toLowerCase()) || str.includes(k))
                    this.#CreativeCommons[k] = true;
            }
        }
    }
    description() {
        if (this.#CreativeCommons.CC0) return 'CC0';
        let result = 'CC';
        if (this.#isCreativeCommons) {
            for (let key in this.#CreativeCommons)
                if (this.#CreativeCommons[key])
                    result += '-' + key;
        } else {
            result = 'Private';
        }
        return result;
    }
    /**
     * 
     * @param {'BY'|'NC'|'SA'|'ND'|'CC0'} k 
     * @returns {boolean}
     */
    includes(k) {
        return this.#CreativeCommons[k];
    }
    /**
     * @returns {boolean}
     */
    is_cc_license() {
        return this.#isCreativeCommons;
    }
}

class Datz {
    y = 1970; m = 1; d = 1;
    /**
     * 
     * @param {number} y 
     * @param {number} m 
     * @param {number} d 
     */
    constructor(y, m, d) {
        [this.y, this.m, this.d] = [y, m, d];
    }
    compareWith(datz) {
        if (datz.y > this.y) return 1;
        if (datz.y < this.y) return -1;
        if (datz.m > this.m) return 1;
        if (datz.m < this.m) return -1;
        if (datz.d > this.d) return 1;
        if (datz.d < this.d) return -1;
        return 0;
    }
    isEarlierThan(datz) {
        return this.compareWith(datz) == -1;
    }
    isLaterThan(datz) {
        return !this.compareWith(datz) == 1;
    }
    toPathString() {
        return this.toString('/');
    }
    toString(separator) {
        if (typeof (separator) != 'string') separator = '-';
        return this.y + separator + this.m + separator + this.d;
    }
}

class Post {
    static sort(a, b) {
        return a.datz.compareWith(b.datz);
    }
    static testHasH1(string) {
        return /\n# /.test(string);
    }
    raw_string= '';
    content= '';
    html= '';
    author= '';
    license= '';
    category;
    tags;
    keywords;
    id= 0;
    date;
    lastModifiedDate;
    ECMA262Date;
    isTopped = false;
    foreword;
    prevID;
    nextID;
    transformedTitle;
    wordCount = 0;
    title;
    datz;
    old = false;
    property;
    getParsed(type) {
        switch (type) {
            case "foreword":
            case "content":
                return this.parsed[type];
        }
    }
    path(type) {
        switch (type) {
            case "website":
                return this.paths.website;
            case "local":
                return this.paths.local;
        }
    }
    paths = {
        website: '',
        local: ''
    }
    parsed = {
        content: '',
        foreword: ''
    }
    /**
     * 
     * @param {string} path
     */
    constructor(path, id) {
        let fstat = statSync(path);
        this.lastModifiedDate = fstat.ctime;
        let raw_string = readFileSync(path).toString();
        this.raw_string = raw_string;
        const lines = raw_string.split("\n");
        let getted = {
            title: "Untitled",
            date: '1970-1-1',
            category: " ",
            tags: " ",
            license: 'byncsa'
        };
        let i = 0;
        if (lines[i] === "---") {
            i++;
            while (lines[i] !== "---") {
                let __tempor_val = lines[i].split(":");
                getted[__tempor_val.shift()] = __tempor_val.map(v => v[0] == ' ' ? v.replace(' ', '') : v).join(":");
                i++;
            }
            i++;
        }
        this.property = getted;

        this.title = getted.title;
        this.category = getted.category.split(" ").filter(v => v != '');
        this.tags = getted.tags.split(" ").filter(v => v != '');
        this.isTopped = getted.top ? true : false;
        this.date = new Date(getted.date);
        this.license = new License(getted.license || '');
        this.imageUrl = getted.imageUrl || '';
        if (getted.old) {
            this.old = true;
            warn(['OLD POST', 'YELLOW'], [this.title, 'MAGENTA']);
        }
        if (!getted.keywords) this.keywords = this.tags;
        else this.keywords = getted.keywords.split(" ").filter(v => v != '');

        let gz = getted.date.split(/[\ \-\.]/).filter(v => v).map(v => parseInt(v));
        let moreIndex = lines.indexOf('<!--more-->');

        if (moreIndex == -1) {
            /* No foreword provided */
            this.content = lines.slice(i).join('\n');
        } else {
            this.content = lines.slice(moreIndex).join('\n');
        }
        if (!Post.testHasH1(this.content)) this.content = '# ' + this.title + '\n' + this.content;
        this.foreword = lines.slice(i, (moreIndex !== -1) ? moreIndex : 5).join('\n').replace(/\#*/g, '');
        let fwc = word_count(this.foreword);
        this.wordCount = word_count(this.content);

        if (fwc <= 1) {
            warn(['NO FOREWORD', 'RED'], [this.title, 'MAGENTA', 'NONE']);
        } else if (fwc < 25) {
            warn(['TOO SHORT FOREWORD', 'YELLOW'], [this.title, 'MAGENTA', 'NONE']);
        } else if (fwc > 200) {
            warn(['TOO LONG FOREWORD', 'RED'], [this.title, 'MAGENTA', 'NONE']);
        }

        {
            let coll_strict = {
                category: this.category.join(", "),
                tags: this.tags.join(", ")
            }
            if (this.foreword == '')
                this.foreword = GString.parse(db.settings.get('build.no_foreword_text') || '', new Collection(coll_strict));
        }

        this.datz = new Datz(...gz);
        this.ECMA262Date = this.date.toDateString();

        this.transformedTitle = getted.title.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;\"\'～\·\「\」；：‘’\“\”，\。\《\》？！\￥\…\、（）]+/g, '');

        this.id = id;
        let tempor_val = `read/${(+gz.join("")).toString(36)}${new Buffer.from(this.transformedTitle).toString("base64")}`;

        this.paths.website = `/${tempor_val}/`
        this.paths.local = `${tempor_val}/index.html`
        this.parsed.content = minify(parse(this.content,{mangle:false,headerIds:false}),{removeComments:true,collapseWhitespace:true})
        this.parsed.foreword = minify(parse(this.foreword,{mangle:false,headerIds:false}),{removeComments:true,collapseWhitespace:true})
    }
    setPath(path) {
        this.pathto = path;
    }
    setPrev(id) {
        this.prevID = id;
    }
    setNext(id) {
        this.nextID = id;
    }
}

class BuiltinDescriptivePostContainer {
    #sort_name
    included = []
    constructor(name, v) {
        this.#sort_name = name
        this.included.push(v)
    }
    name = () => this.#sort_name
    includes = (id) => this.included.includes(id)
    add = (id) => !this.includes(id) && this.included.unshift(id);
}

class Tag extends BuiltinDescriptivePostContainer {
    tagname;
    constructor(name, v) {
        super(name, v);
        this.tagname = name;
    }
}

class Category extends BuiltinDescriptivePostContainer {
    catename;
    constructor(name, v) {
        super(name, v);
        this.catename = name;
    }
}

export {
    Template,
    License,
    Datz,
    Tag,
    Category,
    Post
}