const PATH = require("path");
const FS = require("fs");
const MARKED = require("marked");
const UTILS = require("./utils");

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

function readDirectoryRecursive(Directory) {
    let returns = new Array;
    for (let item of FS.readdirSync(Directory)) {
        let path = PATH.join(Directory, item);
        let stat = FS.statSync(path);
        if (stat.isDirectory()) returns.push(...readDirectoryRecursive(path));
        else returns.push(path);
    }
    return returns;
}

function ReadPosts(POST_DIR, SPECIAL_POSTS) {
    let bid = 0;
    UTILS.Log.PICKING_UP("Reading directoty: "+POST_DIR,1);
    let Posts = new Array,
        Specials = {};
    for (let path of readDirectoryRecursive(POST_DIR)) {

        let item = PATH.basename(path, POST_DIR);
        let file_text = FS.readFileSync(path).toString();
        let file_data = ReadData(file_text);
        file_data.content = MARKED.parse(file_data.content);
        file_data.bid = bid;
        UTILS.Log.PROGRESS("Read File: "+path,2);
        if (SPECIAL_POSTS.includes(item)) Specials[item] = file_data;
        else Posts.push(file_data);
        bid += 1;
    }
    UTILS.Log.FINISH_TASK("Read directory",1);
    return {
        Posts,
        Specials
    };
}
exports.ReadPosts = (POST_DIR, SPECIAL_POSTS) => ReadPosts(POST_DIR, SPECIAL_POSTS);