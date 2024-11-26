/*
    This file uses experimental Database 2.0 in some parts.
*/
import AbstractPost from '#class/AbstractPost';
import database from '#database';
import Markdown from '#util/Markdown';
import Text from '#util/Text';
import NewPromise from '#util/NewPromise';
import {stat,readFile} from "node:fs/promises";

import License from '#class/license';
import FuzzyDate from '#class/fuzzydate';
import Collection from '#class/collection';
import db from '#core/database';
import GString from '#core/gstring';
import { relative } from 'path';
import { gfmHeadingId } from 'marked-gfm-heading-id';
import { statSync,readFileSync } from 'fs';
import { warn } from '#core/run';
import dynamicImport from '#util/dynamicImport';

let markdown = new Markdown();
// do markdown initialization
let markdownInit = (async function(){
    await database.initDone();
    if(database.data.feature.enabled.includes('generator/allow-custom-marked-extension')){
        let extensionList = database.data.feature.options?.['generator/allow-custom-marked-extension']?.extensions;
        let canOperate = true;
        if(!Array.isArray(extensionList)){
            console.error('"generator/allow-custom-marked-extension" is enabled, but feature-option>generator/allow-custom-marked-extension>extensions is not an array.');
            canOperate = false;
        }
        if(canOperate){
            for(let exName of extensionList) {
                let extension = await dynamicImport(exName);
                if(typeof extension.default === 'function'){
                    markdown.use(extension.default());
                } else {
                    warn(['[Post]'],[`In Feature <generator/allow-custom-marked-extension>: ${exName} did not export default as a function. valueOf=${extension.default.valueOf()}.`]);
                    if(typeof extension.default.default === 'object') {
                        warn(['[Post]'],[`Trying to load default.default as default().`]);
                        markdown.use(extension.default.default);
                    }
                }
            }
        }
    }
    if(database.data.feature.enabled.includes('generator/markdown-no-header-id')){
        markdown.setOption('noHeaderIds',true);
    } else {
        markdown.use(gfmHeadingId({}));
    }
})();

let minifier;
let regExps = {
    MATCH_H1: /\n# /,
    NO_SUFFIX: /\..*?$/
};

class Post extends AbstractPost {
    /**
     * 
     * @param {string} path
     */
    constructor(path, id) {
        super();
        let filePath = path;
        let {promise, resolve} = NewPromise.withResolvers();
        this.done = promise;
        stat(filePath).then((stat) => {
            this.fileStat = stat;
            return readFile(filePath);
        }).then((buffer)=>{
            let rawString = buffer.toString();
            this.fileContent = rawString;

            let { properties, postContent } = Post.resolveContent(rawString);
            this.properties = properties;
            this.postContent = postContent;

            this.date = new Date(properties.date);
            this.license = new License(properties.license);
        }).then(()=>{
            resolve();
        });
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
            license: 'CC BY-NC-SA 4.0'
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
         is used to store atestHll the configuration
* `AbstractPost`
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
        this.imageUrl = getted.imageUrl || '';

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
        if (!Post.hasH1(this.content)){
            this.content = '# ' + this.title + '\n' + this.content;
        }

        this.foreword = lines.slice(i, (moreIndex !== -1) ? moreIndex : 5).join('\n').replace(/\#*/g, '');
        if(Text.wordCount(this.foreword)<=1){
            let forewordCollection = new Collection({
                category: this.category.join(", "),
                tags: this.tags.join(", "),
                title: this.title,
                author: this.author
            });
            this.foreword = GString.parse(db.config?.default?.foreword ?? '', forewordCollection);
        }

        this.wordCount = Text.wordCount(this.content);

        this.fuzzyDate = new FuzzyDate(getted.date);
        this.datz = this.fuzzyDate;

        this.transformedTitle = Text.removeSymbols(getted.title);

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
        await markdownInit;
        let parsedContent = markdown.parse(this.content);
        let parsedForeword = markdown.parse(this.foreword);
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
