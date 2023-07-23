const PATH = require("path");
const FS = require("fs");
const MARKED = require("marked");

/**
 * 
 * @param { string } content 
 * @returns {{title:string,date:string,category:string,path:string,src:string,content:string,top:boolean}}
 */
function ReadData(content) {
    const lines = content.split("\n");
    const data = {};
    let i = 0;

    if (lines[i] === "---") {
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
    data.path = `${data.date.replace(/-/g,"/")}/${data.title.replace(/[ ?!]/g,"-")}/index.html`;
    data.src = `/${data.date.replace(/-/g,"/")}/${data.title.replace(/[ ?!]/g,"-")}/`;
    data.top = data.top ? true : false;
    data.content = lines.slice(i).join("\n");
    data.less = extractLess(data.content);
    return data;
}

function extractLess(content) {
    const lines = content.split("\n");
    const moreIndex = lines.indexOf("<!--more-->");

    if (moreIndex !== -1) {
        return MARKED.parse(lines.slice(0, moreIndex).join("\n").replace(/\#*/g, ""));
    } else {
        return MARKED.parse(lines.slice(0, 5).join("\n").replace(/\#*/g, ""));
    }
}

function ReadPosts(POST_DIR, SPECIAL_POSTS) {
    console.log('[Picking up] ReadPosts() Reading directory from param POST_DIR: ' + POST_DIR);
    let Posts = new Array,
        Specials = {};
    for (let item of FS.readdirSync(POST_DIR, {
            recursive: true
        })) {

        let path = PATH.join(POST_DIR, item);
        let stat = FS.statSync(path);
        if (stat.isDirectory()) continue;
        console.log('   [Parsing] Reading File: ' + path);
        let file_text = FS.readFileSync(path).toString();
        let file_data = ReadData(file_text);
        let markdown_content = MARKED.parse(file_data.content);
        file_data.content = markdown_content;
        if (SPECIAL_POSTS.includes(item)) Specials[item] = file_data;
        else Posts.push(file_data);
    }
    console.log('[Finish Task] Read directory:' + POST_DIR);
    return {
        Posts,
        Specials
    };
}
exports.ReadPosts = (POST_DIR, SPECIAL_POSTS) => ReadPosts(POST_DIR, SPECIAL_POSTS);