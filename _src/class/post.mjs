import License from '#class/license';
import FuzzyDate from '#class/fuzzydate';
import Collection from '#class/collection';
import db from '#core/database';
import GString from '#core/gstring';
import { relative } from 'path';
import { marked } from 'marked';
import { gfmHeadingId } from 'marked-gfm-heading-id';
// import { minify } from 'html-minifier';
import { statSync,readFileSync } from 'fs';
import TEXT from '#core/text_process';
import { warn } from '#core/run';
import dynamicImport from '#util/dynamicImport';

let minifier;
let regExps = {
    MATCH_H1: /\n# /,
    NO_SUFFIX: /\..*?$/
};

class Post {
    static sort(a, b) {
        return a.fuzzyDate.compareWith(b.fuzzyDate);
    }
    static testHasH1(string) {
        return regExps.MATCH_H1.test(string);
    }
    raw_string= '';
    content= '';
    foreword= '';
    author;
    title;
    license;
    /**
     * Through there is no need to use array
     * because only few people put one their post
     * into a LOT of categories
     * BUT we think it's necessary for fewu
     * @type {string[]}
     */
    category;
    tags;
    keywords;
    date;
    lastModifiedDate;
    fuzzyDate;
    top = false;
    prevID;
    nextID;
    id= 0;
    transformedTitle;
    wordCount = 0;
    property;
    path = {
        website: '',
        local: ''
    }
    parsed = {
        content: '',
        foreword: ''
    }

    /**
     * @deprecated use [!!property?.old]
     */
    old = false;
    /**
     * @deprecated use [date.toLocaleDateString(settings.language,{dateStyle:'full'})]
     */
    ECMA262Date;
    /**
     * @deprecated use [fuzzyDate]
     */
    datz;


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
        /*
         The [property] property
         is used to store all the configuration
         in a post. 
         That's because we could not set up a
         property just because a user used it.
         So theme should use [property] to
         get some unnecessary configuration.
         e.g. Highlight
        */
        this.property = getted;

        this.title = getted.title;
        this.author = getted.author ?? db.config.user?.name;
        this.category = getted.category.split(" ").filter(v => v != '');
        this.tags = getted.tags.split(" ").filter(v => v != '');
        
        this.date = new Date(getted.date);
        this.license = new License(getted.license || '');
        this.imageUrl = getted.imageUrl || '';

        this.top = !!getted.top;
        this.old = !!getted.old;
        /*
         As the [old] property is being deprecated
         that we disabled this warning.
         Use [property.old] if you need to detect
         whether it is an old format post.
        */
        // if (this.old) {
        //     warn(['OLD POST', 'YELLOW'], [this.title, 'MAGENTA']);
        // }

        this.keywords = getted.keywords?.split(" ").filter(v => v != '') ?? this.tags;
        // this.keywords = getted.keywords.split(" ").filter(v => v != '');

        // parse this to FuzzyDate constructor
        let gz = getted.date.split(/[\ \-\.]/).filter(v => v).map(v => parseInt(v));

        let moreIndex = lines.indexOf('<!--more-->');

        if (moreIndex === -1) {
            /* No foreword provided */
            this.content = lines.slice(i).join('\n');
        } else {
            this.content = lines.slice(moreIndex).join('\n');
        }
        // Automatically parse a title to content.
        // So there is no need to manually write a heading
        // if it's the same as title
        if (!Post.testHasH1(this.content)){
            this.content = '# ' + this.title + '\n' + this.content;
        }

        this.foreword = lines.slice(i, (moreIndex !== -1) ? moreIndex : 5).join('\n').replace(/\#*/g, '');
        this.wordCount = TEXT.getTotalWordCount(this.content);

        // Warn the users if they write their foreword
        // too long or too short
        // Feature: <markdown:foreword/warn>
        (()=>{
            let fwc = TEXT.getTotalWordCount(this.foreword);
            if(db.config.enabledFeatures?.includes('markdown:foreword/warn')){
                let borderShort = db.config.featureConfig?.['foreword/warn']?.short ?? 25;
                let borderLong = db.config.featureConfig?.['foreword/warn']?.long ?? 200;
                if (fwc <= 1) {
                    warn(['No Foreword for', 'RED'], [this.title, 'MAGENTA', 'NONE']);

                } else if (fwc < borderShort) {
                    warn(['Foreword is too short for', 'YELLOW'], [this.title, 'MAGENTA', 'NONE']);
                } else if (fwc > borderLong) {
                    warn(['Foreword is too long for', 'YELLOW'], [this.title, 'MAGENTA', 'NONE']);
                }
            }
            // Feature: <markdown:foreword/nullOnDefault>
            if(! db.config.enabledFeatures?.includes('markdown:foreword/nullOnDefault') && fwc <=1){
                let coll_strict = {
                    category: this.category.join(", "),
                    tags: this.tags.join(", "),
                    title: this.title,
                    author: this.author
                }
                this.foreword = GString.parse(db.config?.default?.foreword || '', new Collection(coll_strict));
            }
        })();

        this.fuzzyDate = new FuzzyDate(getted.date);
        this.datz = this.fuzzyDate;
        this.ECMA262Date = this.date.toDateString();

        this.transformedTitle = getted.title.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;\"\'～\·\「\」；：‘’\“\”，\。\《\》？！\￥\…\、（）]+/g, '');

        this.id = id;
        
        // Path process
        if(db.config?.feature?.enable?.includes('fewu:path/local/noSuffix')){
            path = path.replace(regExps.NO_SUFFIX,'');
        }
        // Feature <fewu:path/flat>
        if(db.config?.feature?.enable?.includes('fewu:path/flat') || db.config?.enabledFeatures?.includes('fewu:path/flat')){
            let tempor_val = `read/${this.fuzzyDate.toString()}:${relative(db.dirs.posts,path).replace(/\//g,':')}`;
            this.path.website = `/${tempor_val}.html`;
            this.path.local = `${tempor_val}.html`;
            // this.paths = this.path;
        } else {
            let tempor_val = `read/${gz.join('/')}/${relative(db.dirs.posts,path).replace(/\//g,':')}`;
            this.path.website = `/${tempor_val}/`;
            this.path.local = `${tempor_val}/index.html`;
            // this.paths = this.path;
        }

    }

    // Consturctor does not support native asynchronous function.
    async doAsynchronousConstructTasks(){
        let parsedContent, parsedForeword;
        // Feature <markdown:noHeaderId>
        if(db.config?.feature?.enable?.includes('markdown:noHeaderId')){
            parsedContent = marked(this.content,{mangle:false,headerIds:false});
            parsedForeword = marked(this.foreword,{mangle:false,headerIds:false});
        } else {
            marked.use(gfmHeadingId({}));
            parsedContent = marked(this.content,{mangle:false});
            parsedForeword = marked(this.foreword,{mangle:false});
        }
        // Feature <markdown:HTMLMinifier>
        if(db.config?.feature?.enable?.includes('markdown:HTMLMinifier')){
            if(minifier === undefined){
                minifier = await dynamicImport('html-minifier');
                if(minifier === null){
                    warn(['[Post]'],['Failed to import html-minifier. Ignoring feature <markdown:HTMLMinifier>. Please install html-minifier.']);
                }
            }
            if(minifier){
                parsedContent = minifier.minify(parsedContent,{removeComments:true,collapseWhitespace:true});
                parsedForeword = minifier.minify(parsedForeword,{removeComments:true,collapseWhitespace:true});
            }
        }
        this.parsed.content = parsedContent;
        this.parsed.foreword = parsedForeword;
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

export default Post;
