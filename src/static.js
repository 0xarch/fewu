const ejs = require("ejs");
const Fs = require("fs");
const FsExtra = require("node-fs-extra");
const Path = require("path");
const POST = require("./post");
const SORT = require("./sorter");

const PUBLIC_DIR = "./public";
const CONF = require("./conf").CONF;

const ABOUT = POST.ABOUT;
const POSTS = SORT.DEFAULT_POSTS;
const RECENT_POSTS=SORT.RECENT_POSTS;
const CATEGORY_POSTS=SORT.CATEGORY_POSTS;
const EXTENSIONS = POST.extensions;

const LAYOUT_DIR = `./conf/layout/${CONF.lookAndFeel.layout}`;
const THEME_DIR = `./conf/theme/${CONF.lookAndFeel.theme}`;

const layouts = {
    index : POST.insertItems(Fs.readFileSync(`${LAYOUT_DIR}/index.ejs`).toString().replace(/<%\! extensions \!%>/g,EXTENSIONS)),
    archive : POST.insertItems(Fs.readFileSync(`${LAYOUT_DIR}/archive.ejs`).toString().replace(/<%\! extensions \!%>/g,EXTENSIONS)),
    category : POST.insertItems(Fs.readFileSync(`${LAYOUT_DIR}/category.ejs`).toString().replace(/<%\! extensions \!%>/g,EXTENSIONS)),
    post : POST.insertItems(Fs.readFileSync(`${LAYOUT_DIR}/post.ejs`).toString().replace(/<%\! extensions \!%>/g,EXTENSIONS)),
    about: POST.insertItems(Fs.readFileSync(`${LAYOUT_DIR}/post.ejs`).toString().replace(/<%\! extensions \!%>/g,EXTENSIONS)),
}

var cateArr = Array();
POSTS.forEach(item=>{
    if (!cateArr.includes(item.category)) cateArr.push(item.category);
});

const GINFO = {
    postCount:POSTS.length,
    cateCount:cateArr.length,
    cateArr
};

function build(type,extra,path){
    const content = ejs.render(layouts[type],{...extra,info:CONF,extensions:EXTENSIONS,ginfo:GINFO,POSTS,RECENT_POSTS,CATEGORY_POSTS},{views:[LAYOUT_DIR]}).toString();
    Fs.mkdirSync(Path.dirname(path),{recursive:true},()=>{});
    Fs.writeFile(`${path}`,content,err=>{if(err)throw err});
}

function ending(){
    FsExtra.copy(THEME_DIR,`${PUBLIC_DIR}/css`,(err)=>{if(err)throw err});
    console.log("Successfully processed")
}

exports.CONF=CONF;
exports.PUBLIC_DIR=PUBLIC_DIR;
exports.POSTS=POSTS;
exports.ABOUT=ABOUT;
exports.BUILD=(type,extra,path)=>build(type,extra,path);
exports.ENDING=ending();