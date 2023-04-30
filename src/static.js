const ejs = require("ejs");
const Fs = require("fs");
const FsExtra = require("node-fs-extra");
const Path = require("path");

const LOG=console.log;
const POST = require("./post");
const SORT = require("./sorter");

const PUBLIC_DIR = "./public";
const CONF = require("./conf").CONF;

const ABOUT = POST.ABOUT;
LOG("Getting Posts from sorter");
const POSTS = SORT.DEFAULT_POSTS;
const DATE_POSTS = SORT.DATE_POSTS;
const RECENT_POSTS=SORT.RECENT_POSTS;
const CATEGORY_POSTS=SORT.CATEGORY_POSTS;
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

const ALL_SORTS = {
    POSTS: SORT.DEFAULT_POSTS,
    DATE_POSTS: SORT.DATE_POSTS,
    RECENT_POSTS: SORT.RECENT_POSTS,
    CATEGORY_POSTS: SORT.CATEGORY_POSTS,
}

async function build(type,extra,path){
    LOG(`Building [${type}] to ${path}`);
    const content = ejs.render(layouts[type],{...extra,info:CONF,extensions:EXTENSIONS,ginfo:GINFO,...ALL_SORTS},{views:[LAYOUT_DIR]}).toString();
    Fs.mkdirSync(Path.dirname(path),{recursive:true},()=>{});
    Fs.writeFile(`${path}`,content,err=>{
        if(err) throw err;
        else LOG(`Successfully built ${path}`);
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
