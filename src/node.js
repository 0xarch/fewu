console.log('[Starting up] Hogger 0.0.1');
const EJS = require("ejs");
const FS_EXTRA = require("node-fs-extra");
const FS = require("fs");
const PATH = require("path");

const ARGS = process.argv;
const CONFIG = JSON.parse(FS.readFileSync(ARGS[2]).toString());
const EMPTY_FN = () => {};
console.log('[10%] Read Config');

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
console.log('[25%] Read Posts');

const TemplateVariables = {
    Posts,
    user: CONFIG.user,
    lookAndFeel: LOOK_AND_FEEL
};

for (let item of LAYOUT_CONFIG.pages) {
    let filename = PATH.join(LAYOUT, item.build.filename),
        destname = PATH.join(PUBLIC_DIR, item.build.destname, 'index.html');
    let inconf_extra = {};
    if (item.build.extras) inconf_extra = eval('let _intpvar=' + item.build.extras + ';_intpvar');
    build_file(FS.readFileSync(filename).toString(), {
        filename,
        ...TemplateVariables,
        ...Sorts,
        ...inconf_extra
    }, destname);
}
console.log('[50%] Build Pages');
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
console.log('[90%] Build Blogs');
FS_EXTRA.copy(THEME, PATH.join(PUBLIC_DIR, 'theme'), EMPTY_FN);
console.log('[100%] Finished!');

async function build_file(ejs_template, ejs_extra_json, path) {
    console.log('   [In Progress] Building file to path from param path: ' + path);
    let content = EJS.render(ejs_template, ejs_extra_json);
    FS_EXTRA.mkdirsSync(PATH.resolve(path, '..'));
    FS.writeFile(path, content, EMPTY_FN);
}