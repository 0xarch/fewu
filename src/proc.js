const tml = require("./parser");
const info = require("./conf").CONF;
const matcher = require("./matcher");

const Fs = require("fs");
const Path = require("path");

const SORT = require("./sorter");
const POSTS = SORT.DEFAULT_POSTS;

const Layouts = {
    index: tml.parseTml("index"),
    archive: tml.parseTml("archive"),
    category: tml.parseTml("category"),
    post: tml.parseTml("post"),
    about: tml.parseTml("post")
};

const PublicDir="./public";
const ThemeDir=`./conf/theme/${info.lookAndFeel.theme}`;
const LayoutDir=`./conf/layout/${info.lookAndFeel.layout}`;

async function build(type,extra,path){
    console.log(`<Progress> Building [${type}] to ${path}`);
    var content = Layouts[type];
    content = tml.parseVar(content,extra);
    content = matcher.parseBuiltin(content,type,extra.post);
    Fs.mkdir(Path.dirname(path), { recursive: true }, () => { });
    Fs.writeFile(`${path}`,content,err=>{
        if(err) throw err;
        else console.log(`<Success> built ${path}`);
    });
}

exports.build=(type,extra,path)=>build(type,extra,path);
exports.posts=POSTS;
exports.about=require("./post").ABOUT;
exports.PublicDir=PublicDir;
exports.ThemeDir=ThemeDir;
exports.LayoutDir=LayoutDir;