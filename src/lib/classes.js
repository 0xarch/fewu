import { parse } from "marked";
import { word_count } from "./reader.js";


class License{
    #CreativeCommons = {
        BY : false,
        NC : false,
        ND : false,
        SA : false,
        CC0: false,
    }
    #isCreativeCommons = true;
    /**
     * 
     * @param {string} str 
     */
    constructor(str){
        str = str.toLowerCase();
        if(str.includes('private')) this.#isCreativeCommons = false;
    }
    description(){
        let result='CC';
        if(this.#isCreativeCommons){
            for(let key in this.#CreativeCommons)
                result += '-'+key;
        } else {
            result = 'Private';
        }
        return result;
    }
}

class Datz {
    y=1970;m=1;d=1;
    /**
     * 
     * @param {number} y 
     * @param {number} m 
     * @param {number} d 
     */
    constructor(y,m,d){
        this.y = y;
        this.m = m;
        this.d = d;
    }
    compareWith(datz){
        if(datz.y>this.y)return true;
        if(datz.y<this.y)return false;
        if(datz.m>this.m)return true;
        if(datz.m<this.m)return false;
        if(datz.d>this.d)return true;
        return false;
    }
    isEarlierThan(datz){
        return this.compareWith(datz);
    }
    isLaterThan(datz){
        return !this.compareWith(datz);
    }
    toPathString(){
        return this.y+'/'+this.m+'/'+this.d;
    }
}

/**
 * @experimental
 * @since v2
 */
class Post{
    raw_string;
    content;
    html;
    author;
    license;
    category;
    tags;
    id;
    date;
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
    /**
     * 
     * @param {string} raw_string 
     */
    constructor(raw_string){
        this.raw_string = raw_string;
        const lines = raw_string.split("\n");
        let getted = {
            title: "Untitled",
            date: null,
            category: " ",
            tags: " ",
            license: 'byncsa'
        };
        let i = 0;
        if (lines[i] === "---") {
            i++;
            while (lines[i] !== "---") {
                let __tempor_val = lines[i].split(":");
                getted[__tempor_val.shift()] = __tempor_val.join(":");
                i++;
            }
            i++;
        }
        this.title = getted.title;
        this.content = lines.slice(i).join('\n');
        const moreIndex = lines.indexOf('<!--more-->');
        this.foreword = lines.slice(i, (moreIndex !== -1) ?moreIndex :5) .join('\n').replace(/\#*/g,'');
        this.parsedForeword = parse(this.foreword);
        this.tags = getted['tags']?getted.tags.split(" "):[];
        this.html = parse(this.content);
        this.isTopped = getted.top?true:false;
        this.date = new Date(getted.date);
        this.wordCount = word_count(this.content);
        this.imageUrl = getted.imageUrl||'';
        this.category = getted.category.split(" ").filter(v=>v!='');
        this.tags = getted.tags.split(" ").filter(v=>v!='');
        this.license = new License(getted.license||'');
        this.ECMA262Date = this.date.toDateString();
        this.datz = new Datz(this.date.getFullYear(),this.date.getMonth()+1,this.date.getDay());
        this.transformedTitle = getted.title.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;\"\'\～\·\「\」\；\：\‘\’\“\”\，\。\《\》\？\！\￥\…\、\（\）]/g,'_');
        this.websitePath = `/${this.datz.toPathString()}/${this.transformedTitle}.html`;
        this.publicFilePath = `${this.datz.toPathString()}/${this.transformedTitle}.html`;
    }
    setPath(path){
        this.pathto = path;
    }
    setID(id){
        this.id = id;
    }
    setPrev(id){
        this.prevID = id;
    }
    setNext(id){
        this.nextID = id;
    }
}

class Tag{
    tagname;
    included_articles = [];
    constructor(tagname,included_articles){
        this.tagname = tagname;
        this.included_articles = included_articles;
    }
    add(id){
        this.included_articles.push(id);
    }
    includes(id){
        return this.included_articles.includes(id);
    }
}

class Category{
    catename;
    included_articles = [];
    constructor(catename,included_articles){
        this.catename = catename;
        this.included_articles = included_articles;
    }
    add(id){
        this.included_articles.push(id);
    }
    includes(id){
        return this.included_articles.includes(id);
    }
}

export {
    Post,
    License,
    Tag,
    Category
}