/*
    This file uses experimental Database 2.0 in some parts.
*/
import AbstractPost from '#class/AbstractPost';
import License from '#class/license';
import FuzzyDate from '#class/fuzzydate';

import database from '#database';

import dynamicImport from '#util/dynamicImport';
import Markdown from '#util/Markdown';
import TemplateString from '#util/TemplateString';
import Text from '#util/Text';
import NewPromise from '#util/NewPromise';
import {stat,readFile} from "node:fs/promises";

import { warn } from '#core/run';

import { relative } from 'path';
import { gfmHeadingId } from 'marked-gfm-heading-id';

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
        this.filePath = filePath;
        stat(filePath).then((stat) => {
            this.fileStat = stat;
            return readFile(filePath);
        }).then((buffer)=>{
            let rawString = buffer.toString();
            this.fileContent = rawString;

            let { properties, postContent, postIntroduction, referencedImages } = Post.resolveContent(rawString);
            this.properties = properties;
            this.postContent = postContent;
            this.postIntroduction = postIntroduction;
            this.referencedImages = referencedImages;

            if(!database.data.feature.enabled.includes('generator/leave-no-h1')){
                if(!Post.hasH1(this.postContent)){
                    this.postContent = `# ${properties.title}\n` + this.postContent;
                }
            }
            
            this.title = properties.title;
            this.author = properties.author ?? database.data.user.name;
            this.categories = properties.category.split(" ");
            this.tags = properties.tags.split(" ");
            this.date = new Date(properties.date);
            this.fuzzyDate = new FuzzyDate(properties.date);
            this.license = new License(properties.license);
            this.wordCount = Text.wordCount(postContent);

            this.generalId = id;

            let calcPath = path;

            if(database.data.feature.enabled.includes('path/no-md-suffix')){
                calcPath = calcPath.replace(regExps.NO_SUFFIX,'');
            }

            if(database.data.feature.enabled.includes('path/flatten')){
                let tempor_val = `read/${this.fuzzyDate.toString()}:${relative(database.data.directory.postDirectory,calcPath).replace(/\//g,':')}`;
                this.path.website = `/${tempor_val}.html`;
                this.path.local = `${tempor_val}.html`;
            } else {
                let tempor_val = `read/${this.fuzzyDate.toString('/')}/${relative(database.data.directory.postDirectory,calcPath).replace(/\//g,':')}`;
                this.path.website = `/${tempor_val}/`;
                this.path.local = `${tempor_val}/index.html`;
            }
        }).then(()=>{
            if(Text.wordCount(this.postIntroduction)<=1){
                let informations = {
                    category: this.categories.join(", "),
                    tags: this.tags.join(", "),
                    title: this.title,
                    author: this.author
                };
                this.postIntroduction = TemplateString.parse(database.data.default.introduction, informations);
            }
            this.foreword = this.postIntroduction;
            this.category = this.categories;
            this.datz = this.fuzzyDate;
            this.id = this.generalId;
            this.keywords = this.properties.keywords?.split(" ") ?? this.tags;
            this.raw_string = this.fileContent;
            this.lastModifiedDate = this.fileStat.ctime;
            this.property = this.properties;
            this.#doParse().then(resolve);
        });
    }

    /**
     * @deprecated
     */
    async doAsynchronousConstructTasks(){}

    async #doParse(){
        await markdownInit;
        let parsedContent = markdown.parse(this.postContent);
        let parsedIntroduction = markdown.parse(this.postIntroduction);
        // Feature <markdown:HTMLMinifier>
        if(database.data.feature.enabled.includes('generator/use-minifier')){
            if(minifier === undefined){
                minifier = await dynamicImport('html-minifier');
                if(minifier === null){
                    warn(['[Post]'],['Failed to import html-minifier. Ignoring feature <markdown:HTMLMinifier>. Please install html-minifier.']);
                }
            }
            if(minifier){
                parsedContent = minifier.minify(parsedContent,{removeComments:true,collapseWhitespace:true});
                parsedIntroduction = minifier.minify(parsedIntroduction,{removeComments:true,collapseWhitespace:true});
            }
        }
        this.parsed.content = parsedContent;
        this.parsed.introduction = parsedIntroduction;
        this.parsed.foreword = parsedIntroduction;
    }
    
    setPrev(id) {
        this.previousId = id;
        this.prevID = id;
    }
    setNext(id) {
        this.nextId = id;
        this.nextID = id;
    }
}

export default Post;
