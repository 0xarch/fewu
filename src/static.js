//const ejs = require("ejs");
const ejsRender = require("ejs").render;
const fs = require("fs");
const copy = require("node-fs-extra").copy;
const Path = require("path");
const LOG=console.log;

// 打印版本
LOG("--------------------------");
LOG("Hogger v0.2.6");
LOG("Based on Node.js");
LOG("2023 0xarch");
LOG("https://github.com/0xarch/");
LOG("--------------------------");

const POST = require("./post.js");
const SORT = require("./sorter.js");
const MATCH = require("./matcher.js");
const CONF = require("./conf.js").CONF;
const PUBLIC_DIR = "./public";

const ABOUT = POST.ABOUT;
LOG("Getting Posts from sorter");
const ALL_SORTS = {
    POSTS: SORT.DEFAULT_POSTS,
    DATE_POSTS: SORT.DATE_POSTS,
    RECENT_POSTS: SORT.RECENT_POSTS,
    CATEGORY_POSTS: SORT.CATEGORY_POSTS,
}
const POSTS = SORT.DEFAULT_POSTS;
const EXTENSIONS = POST.extensions;

const LAYOUT_DIR = `./conf/layout/${CONF.lookAndFeel.layout}`;
const THEME_DIR = `./conf/theme/${CONF.lookAndFeel.theme}`;


LOG("Reading Layouts");
const layouts = {
    index : MATCH.autoParseLayout(`${LAYOUT_DIR}/index.ejs`),
    archive : MATCH.autoParseLayout(`${LAYOUT_DIR}/archive.ejs`),
    category : MATCH.autoParseLayout(`${LAYOUT_DIR}/category.ejs`),
    post : MATCH.autoParseLayout(`${LAYOUT_DIR}/post.ejs`),
    about: MATCH.autoParseLayout(`${LAYOUT_DIR}/post.ejs`),
}

LOG("Reading Categories");
var cateArr = Array();
POSTS.forEach(item=>{
    if (!cateArr.includes(item.category)) cateArr.push(item.category);
});

const GINFO = {
    postCount:POSTS.length,
    cateCount:cateArr.length,
    cateArr
};

async function build(type,extra,path){
    LOG(`<Progress> Building [${type}] to ${path}`);
    var content = MATCH.parseBuiltin(layouts[type],type,extra.post);
    content = ejsRender(content,{...extra,info:CONF,extensions:EXTENSIONS,ginfo:GINFO,...ALL_SORTS},{views:[LAYOUT_DIR]}).toString();
    fs.mkdirSync(Path.dirname(path),{recursive:true},()=>{});
    fs.writeFile(`${path}`,content,err=>{
        if(err) throw err;
        else LOG(`<Success> built ${path}`);
    });
}

function ending(){
    copy(THEME_DIR,`${PUBLIC_DIR}/css`,(err)=>{if(err)throw err});
}

exports.CONF=CONF;
exports.PUBLIC_DIR=PUBLIC_DIR;
exports.POSTS=POSTS;
exports.ABOUT=ABOUT;
exports.BUILD=(type,extra,path)=>build(type,extra,path);
exports.ENDING=ending();
