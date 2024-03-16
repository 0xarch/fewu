import { word_count } from "./reader.js";
import { warn } from "./mod.js";
import { notFake } from "./closures.js";
import { readFileSync, statSync } from "fs";
import { parse } from "marked";
import { Cache } from "../core/struct.js";
import { License, Datz } from "./classes.js";

class Post{
    static sort(a,b){
        return a.datz.compareWith(b.datz);
    }
    static testHasH1(string) {
        return /\n# /.test(string);
    }
    raw_string;
    content;
    html;
    author;
    license;
    category;
    tags;
    keywords;
    id;
    date;
    lastModifiedDate;
    ECMA262Date;
    isTopped = false;
    foreword;
    prevID;
    nextID;
    websitePath;
    publicFilePath;
    transformedTitle;
    pathto = '';
    wordCount = 0;
    title;
    datz;
    old = false;
    property;
    #cache = new Cache;
    getParsed(type){
        switch(type){
            case "foreword":
            case "content":
                // rp stands for 'result of parsing'
                let index = 'rp-'+type;
                if(this.#cache.stored(index))
                    return this.#cache.get(index);
                else {
                    let result = parse(this[type]);
                    this.#cache.set(index,result);
                    return result;
                }
        }
    }
    path(type){
        switch(type){
            case "website":
                return this.paths.website;
            case "local":
                return this.paths.local;
        }
    }
    paths = {
        website: void 0,
        local: void 0
    }
    /**
     * 
     * @param {string} path
     */
    constructor(path,id){
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
                getted[__tempor_val.shift()] = __tempor_val.map(v=>v[0]==' '?v.replace(' ',''):v).join(":");
                i++;
            }
            i++;
        }
        this.property = getted;

        this.title = getted.title;
        this.category = getted.category.split(" ").filter(notFake);
        this.tags = getted.tags.split(" ").filter(notFake);
        this.isTopped = getted.top?true:false;
        this.date = new Date(getted.date);
        this.license = new License(getted.license||'');
        this.imageUrl = getted.imageUrl||'';
        if(getted.old){
            this.old = true;
            warn(['OLD POST','YELLOW'],[this.title,'MAGENTA']);
        }
        if(!getted.keywords) this.keywords = this.tags;
        else this.keywords = getted.keywords.split(" ").filter(notFake);

        let gz = getted.date.split(/[\ \-\.]/).filter(v=>v).map(v=>parseInt(v));
        let moreIndex = lines.indexOf('<!--more-->');

        if(moreIndex == -1){
            /* No foreword provided */
            this.content = lines.slice(i).join('\n');
        } else {
            this.content = lines.slice(moreIndex).join('\n');
        }
        if(!Post.testHasH1(this.content)) this.content = '# '+this.title+'\n'+this.content;
        this.foreword = lines.slice(i, (moreIndex !== -1) ?moreIndex :5) .join('\n').replace(/\#*/g,'');
        let fwc = word_count(this.foreword);
        this.wordCount = word_count(this.content);

        if(fwc <= 1){
            warn(['NO FOREWORD','RED'],[this.title,'MAGENTA','NONE']);
        }else if(fwc < 25){
            warn(['TOO SHORT FOREWORD','YELLOW'],[this.title,'MAGENTA','NONE']);
        }else if(fwc > 200){
            warn(['TOO LONG FOREWORD','RED'],[this.title,'MAGENTA','NONE']);
        }
        if(this.foreword=="") this.foreword = "The author of this article has not yet set the foreword.\n\nCategory(ies): "+this.category.join(", ")+"\n\nTag(s): "+this.tags.join(", ");

        this.datz = new Datz(...gz);
        this.ECMA262Date = this.date.toDateString();
        
        this.transformedTitle = getted.title.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;\"\'\～\·\「\」\；\：\‘\’\“\”\，\。\《\》\？\！\￥\…\、\（\）]+/g,'');

        this.id = id;
        let tempor_val = `read/${(+gz.join("")).toString(36)}${new Buffer.from(this.transformedTitle).toString("base64")}`;
        this.paths = {
            website: `/${tempor_val}/`,
            local: `${tempor_val}/index.html`
        }
    }
    setPath(path){
        this.pathto = path;
    }
    setPrev(id){
        this.prevID = id;
    }
    setNext(id){
        this.nextID = id;
    }
}

export default Post;