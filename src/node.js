const EJS = require("ejs");
const FS_EXTRA = require("node-fs-extra");
const FS = require("fs");
const PATH = require("path");
const UTILS = require("./utils");
UTILS.Log.PICKING_UP("Starting Building");

const ARGS = process.argv;
const CONFIG = JSON.parse(FS.readFileSync(ARGS[2]).toString());
const EMPTY_FN = () => {};
UTILS.Log.SUCCESS("Read Configuation File",1);

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
UTILS.Log.SUCCESS("Read Post Information",1);

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

UTILS.Log.PICKING_UP("Build Pages Included in Theme",1);
for (let item of LAYOUT_CONFIG.pages) {
    let filename = PATH.join(LAYOUT, item.build.filename),
        destname = PATH.join(PUBLIC_DIR, item.build.destname, 'index.html');
    let inconf_extra = {};
    if (item.build.extras) inconf_extra = eval('let _intpvar=' + item.build.extras + ';_intpvar');
    
    // --- CYCLE ---
    if(item.build.cycle&&item.build.cyclebuild){
        let CYCLE = {};
        let _var = item.build.cyclebuild.var;
        let father=eval(_var.father),every=_var.every;
        CYCLE.Enabled=true;
        CYCLE.Total = Math.ceil(father.length / every);
        for(let i=0;i*every<=father.length;++i){
            destname = PATH.join(PUBLIC_DIR, item.build.destname, 'index'+(i+1)+'.html');
            CYCLE[_var.name]=father.slice(i*every,(i+1)*every);
            CYCLE.Time = i+1;
            CYCLE.PrevPage = PATH.join(item.build.destname,'index'+i+'.html');
            CYCLE.NextPage = PATH.join(item.build.destname,'index'+(i+2)+'.html');
            CYCLE.PageDestinationPrefix = PATH.join(TemplateVariables.ROOT,item.build.destname);
            build_file(FS.readFileSync(filename).toString(), {
                filename,
                ...TemplateVariables,
                ...Sorts,
                ...inconf_extra,
                CYCLE
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
UTILS.Log.FINISH_TASK("Built Pages Included in Theme",1);
UTILS.Log.PICKING_UP("Starting Building Blogs",1);
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
UTILS.Log.FINISH_TASK("Built Blogs",1);
FS_EXTRA.copy(THEME, PATH.join(PUBLIC_DIR, 'theme'), EMPTY_FN);
UTILS.Log.FINISH_TASK("Successfully Built!");

async function build_file(ejs_template, ejs_extra_json, path) {
    UTILS.Log.PROCESSING('Building File to Path: '+path,2);
    let content = EJS.render(ejs_template, ejs_extra_json);
    FS_EXTRA.mkdirsSync(PATH.resolve(path, '..'));
    FS.writeFile(path, content, EMPTY_FN);
    UTILS.Log.PROGRESS('Built File: '+path,2);
}