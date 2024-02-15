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

/**
 * @experimental
 * @since v2
 */
class Article{
    raw_string;
    content;
    html;
    author;
    license;
    category;
    id;
    date;
    ECMA262Date;
    isTopped = false;
    foreword;
    prevArticleID;
    nextArticleID;
    websitePath;
    publicFilePath;
    transformedTitle;
    pathto = '';
    wordCount = 0;
    title;
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
            category: "",
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
        this.foreword = lines.slice(0, (moreIndex !== -1) ?moreIndex :5) .join('\n').replace(/\#*/g,'');
        this.parsedForeword = parse(this.foreword);
        this.tags = getted['tags']?getted.tags.split(" "):[];
        this.html = parse(this.content);
        this.isTopped = getted.top?true:false;
        this.date = new Date(getted.date);
        this.wordCount = word_count(this.content);
        this.imageUrl = getted.imageUrl||'';
        if(!getted.category instanceof Array)
            this.category = getted.category.split(" ");
        else this.category = [];
        this.license = new License(getted.license||'');
        this.ECMA262Date = this.date.toDateString();
        let __tempor_datestr = this.date.toLocaleDateString('zh');
        this.transformedTitle = getted.title.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;\"\'\～\·\「\」\；\：\‘\’\“\”\，\。\《\》\？\！\￥\…\、\（\）]/g,'_');
        this.websitePath = `/${__tempor_datestr}/${this.transformedTitle}/`;
        this.publicFilePath = `${__tempor_datestr}/${this.transformedTitle}/index.html`;
    }
    setPath(path){
        this.pathto = path;
    }
    setID(id){
        this.id = id;
    }
    setPrev(id){
        this.prevArticleID = id;
    }
    setNext(id){
        this.nextArticleID = id;
    }
}

class Tag{
    tagname;
    included_articles = [];
    constructor(tagname,included_articles){
        this.tagname = tagname;
        this.included_articles = included_articles;
    }
    includes(id){
        return this.included_articles.includes(id);
    }
}

export {
    Article,
    Tag
}