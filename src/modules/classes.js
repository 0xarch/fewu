import { findLessContent } from "./lib/optam.js";
import { parse } from "marked";

/**
 * @experimental
 * @since v2.0
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
    isTopped;
    foreword;
    prev_passage;
    next_passage;
    constructor(raw_string){
        this.raw_string = raw_string;
        const lines = raw_string.split("\n");
        let data = '';
        let i = 0;
        if (lines[i] === "---") {
            i++;
            while (lines[i] !== "---") {
                data += lines[i];
                i++;
            }
            i++;
        }
        let json = JSON.parse(data);
        this.content = lines.slice(i).join('\n');
        this.foreword = findLessContent(lines);
        this.html = parse(this.content);
        this.isTopped = json.top?true:false;
        this.date = new Date(json.date||'1970-1-1');
        if(json.category instanceof Array)
            this.category = json.category.split(" ");
        else this.category = [];
        let transformed_title = data.title.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;\"\'\～\·\「\」\；\：\‘\’\“\”\，\。\《\》\？\！\￥\…\、\（\）]/g,'_');
        try{ 
            data.path = `${data.date.replace(/[\-\.]/g,"/")}/${transformed_title}/index.html`;
            data.src = `/${data.date.replace(/[\-\.]/g,"/")}/${transformed_title}/`;
        }catch(_) {}
        data.JSDate = new Date(data.date);
        data.Date = data.JSDate.toDateString();
    }
}

export {
    Article
}