import { basename } from "path";
import { parse } from "marked";
import { traverse, readFile } from '../hail.js';
import { readFileSync } from "fs";

function readSinglePost(content,pathto=undefined,config) {
    content = content.replace(/\r/g,'');
    const lines = content.split("\n");
    const data = {};
    let i = 0;

    if (lines[i] === '---') {
        i++;
        while (lines[i] !== "---") {
            const match = lines[i].match(/^(\w+):\s*(.*)/);
            if (match) {
                data[match[1]] = match[2];
            }
            i++;
        }
        i++;
    }
    if(!data.date) data.date='1970-01-01';
    try{
        data.transformed_title = data.title.replace(/[\,\.\<\>\ \-\+\=\~\`\?\/\|\\\!\@\#\$\%\^\&\*\(\)\[\]\{\}\:\;\"\'\～\·\「\」\；\：\‘\’\“\”\，\。\《\》\？\！\￥\…\、\（\）]/g,'_'); 
        data.path = `${data.date.replace(/[\-\.]/g,"/")}/${data.transformed_title}/index.html`;
        data.src = `/${data.date.replace(/[\-\.]/g,"/")}/${data.transformed_title}/`;
        data.top = data.top=="true" ? true : false;
    }catch(e) { throw e }
    data.textContent = lines.slice(i).join('\n');
    data.parsedContent = parse(data.textContent);
    data.less = extractLess(data.textContent);
    data.lessContent = findLessContent(lines);
    if(data.category!=undefined){
        data.category = data.category.split(" ");
    }else{
        data.category=[];
    }
    data.JSDate = new Date(data.date);
    data.Date = data.JSDate.toDateString();
    data.config = config;
    if(pathto) data.pathto = pathto;
    return data;
}

function getPost(post_directory,special_posts,config) {
    let bid = 0;
    let Posts = new Array,
        Specials = {};
    for (let path of traverse(post_directory)) {
        let item = basename(path, post_directory);
        let file_text = readFileSync(path).toString();
        let file_data = readSinglePost(file_text,path,config);
        file_data.bid = bid;
        
        if (special_posts.includes(item)) Specials[item] = file_data;
        else Posts.push(file_data);
        bid ++;
    }
    return {
        Posts,
        Specials
    };
}

export {
    getPost,
    readSinglePost
}