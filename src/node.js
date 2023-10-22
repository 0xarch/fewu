const EJS = require("ejs");
const FS_EXTRA = require("node-fs-extra");
const FS = require("fs");
const PATH = require("path");
const UTILS = require("./utils");
UTILS.Log.PickingUp("Starting Building");

const ARGS = process.argv;
const CONFIG = JSON.parse(FS.readFileSync(ARGS[2]).toString());
const EMPTY_FN = () => {};
UTILS.Log.Success("Read Configuation File",1);

const LAYOUT = CONFIG.look_and_feel.layout_dir,
    THEME = CONFIG.look_and_feel.theme_dir,
    LOOK_AND_FEEL = CONFIG.look_and_feel,
    POST_DIR = CONFIG.build.post_dir,
    PUBLIC_DIR = CONFIG.build.public_dir,
    SPECIAL_POSTS = CONFIG.build.special_posts;

const LAYOUT_CONFIG = JSON.parse(FS.readFileSync(PATH.join(LAYOUT, 'config.json')).toString());

let RawPosts = require("./post").ReadPosts(POST_DIR, SPECIAL_POSTS);
const Posts = RawPosts.Posts,
    Specials = RawPosts.Specials;
const Sorts = require("./sort").getSort(Posts);
UTILS.Log.Success("Read Post Information",1);

const TemplateVariables = {
    Posts,
    user: CONFIG.user,
    lookAndFeel: LOOK_AND_FEEL,
    widgets: CONFIG.widgets,
    build: CONFIG.build,
    ROOT: !["/", "", undefined].includes(CONFIG.build.site_root) ? CONFIG.build.site_root : "",
    CUSTOM_TITLE: LOOK_AND_FEEL.custom_site_title,
    F:(text)=>text.replace(/([\:\/])/g,'\\$1').replace(/</g,"&lt;").replace(/>/g,"&gt;")
};

UTILS.Log.PickingUp("Build Pages Included in Theme",1);
for (let item of LAYOUT_CONFIG.pages) {
    let filename = PATH.join(LAYOUT, item.build.filename),
        destname = PATH.join(PUBLIC_DIR, item.build.destname, 'index.html');
    let inconf_extra = {};
    if (item.build.extras) inconf_extra = eval('let _intpvar=' + item.build.extras + ';_intpvar');
    
    // --- Cycle Building ---
    if(item.build.cycle&&item.build.option){
        UTILS.Log.Processing(`Doing Cycling Building for ${item.build.filename}`,2);
        let Cycling = {};
        let option = item.build.option;
        let father_array = eval(option.father), every = option.every;
        Cycling.Enabled = true;
        Cycling.TotalCount = Math.ceil(father_array.length / every);
        for(let i=0;i*every<=father_array.length;++i){
            destname = PATH.join(PUBLIC_DIR, item.build.destname, 'index'+(i+1)+'.html');
            Cycling[option.name] = father_array.slice(i*every,(i+1)*every);
            Cycling.LoopTime = i+1;
            Cycling.PreviousFile = PATH.join(item.build.destname,'index'+i+'.html');
            Cycling.NextFile = PATH.join(item.build.destname,'index'+(i+2)+'.html');
            Cycling.FileLocationPrefix = PATH.join(TemplateVariables.ROOT,item.build.destname);
            build_file(FS.readFileSync(filename).toString(), {
                filename,
                ...TemplateVariables,
                ...Sorts,
                ...inconf_extra,
                Cycling
            }, destname);
        }
    } else
    build_file(FS.readFileSync(filename).toString(), {
        filename,
        ...TemplateVariables,
        ...Sorts,
        ...inconf_extra,
    }, destname);
}
UTILS.Log.FinishTask("Built Pages Included in Theme",1);
UTILS.Log.PickingUp("Starting Building Blogs",1);
let post_filename = PATH.join(LAYOUT, 'post.ejs');
let post_file = FS.readFileSync(post_filename).toString();
Posts.forEach(item => {
    let destname = PATH.join(PUBLIC_DIR, item.path);
    build_file(post_file, {
        post: item,
        filename: post_filename,
        ...TemplateVariables,
        ...Sorts
    }, destname);
})
UTILS.Log.FinishTask("Built Blogs",1);
FS_EXTRA.copy(THEME, PATH.join(PUBLIC_DIR, 'theme'), EMPTY_FN);
UTILS.Log.FinishTask("Successfully Built!");

async function build_file(ejs_template, ejs_extra_json, path) {
    UTILS.Log.Processing('Building File to Path: '+path,2);
    let content = EJS.render(ejs_template, ejs_extra_json);
    FS_EXTRA.mkdirsSync(PATH.resolve(path, '..'));
    FS.writeFile(path, content, EMPTY_FN);
    UTILS.Log.Progress('Built File: '+path,2);
}