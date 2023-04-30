const ejs = require("ejs");
const Fs = require("fs");
const FsExtra = require("node-fs-extra");
const Path = require("path");
const LOG=console.log;

// 打印版本
LOG("--------------------------");
LOG("Hogger v0.2.2");
LOG("Based on Node.js");
LOG("2023 0xarch");
LOG("https://github.com/0xarch/");
LOG("--------------------------");

const POST = require("./post");
const SORT = require("./sorter");
const PUBLIC_DIR = "./public";
const CONF = require("./conf").CONF;

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
    index : POST.insertItems(Fs.readFileSync(`${LAYOUT_DIR}/index.ejs`).toString()),
    archive : POST.insertItems(Fs.readFileSync(`${LAYOUT_DIR}/archive.ejs`).toString()),
    category : POST.insertItems(Fs.readFileSync(`${LAYOUT_DIR}/category.ejs`).toString()),
    post : POST.insertItems(Fs.readFileSync(`${LAYOUT_DIR}/post.ejs`).toString()),
    about: POST.insertItems(Fs.readFileSync(`${LAYOUT_DIR}/post.ejs`).toString()),
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
    const content = ejs.render(layouts[type],{...extra,info:CONF,extensions:EXTENSIONS,ginfo:GINFO,...ALL_SORTS},{views:[LAYOUT_DIR]}).toString();
    Fs.mkdirSync(Path.dirname(path),{recursive:true},()=>{});
    Fs.writeFile(`${path}`,content,err=>{
        if(err) throw err;
        else LOG(`<Success> built ${path}`);
    });
}

function ending(){
    FsExtra.copy(THEME_DIR,`${PUBLIC_DIR}/css`,(err)=>{if(err)throw err});
}



exports.CONF=CONF;
exports.PUBLIC_DIR=PUBLIC_DIR;
exports.POSTS=POSTS;
exports.ABOUT=ABOUT;
exports.BUILD=(type,extra,path)=>build(type,extra,path);
exports.ENDING=ending();
