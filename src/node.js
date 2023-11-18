const EJS = require("ejs");
const FS_EXTRA = require("node-fs-extra");
const FS = require("fs");
const PATH = require("path");
const UTILS = require("./utils");
UTILS.console.log("开始 - 主任务");

const ARGS = process.argv;
const CONFIG = JSON.parse(FS.readFileSync(ARGS[2]).toString());
const EMPTY_FN = () => {};
const dbg=(...text)=>UTILS.console.dbg(text.join(" "));
UTILS.console.log("完成 - 读取配置文件");

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
    
    /**
     * Varia-building(Varias)
     * To Enable, set build.varias: true
     * Required configuration statements:
     *  build.option.varias: {
     *      parent: <variable name> // this must be {} (paired object)
     * }
     * 
     * Offers:
     *  Varias:{
     *      enabled: boolean, // true
     *      keyName: string, // pair key
     *      value: any, // pair value
     * }
     * 
     * Changes:
     *  destnation -> ${build.destname}/index_${Varias.keyName}.html
     */
    if( item.build.varias && item.build.option.varias ){
        UTILS.Log.Processing(`Doing Varia-building for ${item.build.filename}`,2);
        let Varias = {};
        let option = item.build.option.varias;
        let parent_var = eval(option.parent);
        Varias.enabled = true;
        for(let var_name in parent_var){
            const destSuffix='_'+var_name;
            destname = PATH.join(PUBLIC_DIR, item.build.destname, 'index'+destSuffix+'.html');
            Varias.keyName = var_name;
            Varias.value = parent_var[var_name];
            const _W_vars = {Varias};
            BF_with(_W_vars,item,filename,destname,inconf_extra,destSuffix);
        }
    } else
    BF_with({},item,filename,destname,inconf_extra);
}
UTILS.console.log("开始 - 搭建所有文件");
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
FS_EXTRA.copy(THEME, PATH.join(PUBLIC_DIR, 'theme'), EMPTY_FN);

async function build_file(ejs_template, ejs_extra_json, path) {
    UTILS.console.log('搭建文件',path);
    let content = EJS.render(ejs_template, ejs_extra_json);
    FS_EXTRA.mkdirsSync(PATH.resolve(path, '..'));
    FS.writeFile(path, content, (err)=>{
        if(err)throw err;
        else 
        UTILS.Log.out('完成 - 搭建文件',path);
    });
}

async function BF_with(vars,item,filename,destname,inconf_extra,destSuffix){
    if(destSuffix==undefined) destSuffix="";
    /**
     * Cycl-building(Cycling)
     * To Enable, set build.cycling: true
     * Required configuration statements:
     *  build.option.cycling: {
     *      parent: <variable name>, // this must be [] (Array-like) or {} (JSON)
     *      every: number // integer, slice count
     *      name: string // the name for child variable to use
     * }
     * 
     * Offers:
     *  Cycling: {
     *      enabled: boolean, // true
     *      TotalCount: number,
     *      LoopTime: number,
     *      FileLocationPrefix: string,
     *      PreviousFile: string,
     *      NextFile: string
     * }
     * 
     * Changes:
     *  destnation -> ${build.destname}/index_${Cycling.LoopTime}.html
     */
    if( item.build.cycling && item.build.option.cycling ){
        // UTILS.Log.Processing(`Doing Cycl-building for ${item.name}`,2);
        UTILS.console.log('Cycl - ',item.name);
        let Cycling = {};
        let option = item.build.option.cycling;
        // aro stands for "array or object"
        let father_aro = [], every = option.every;
        with(vars){
            father_aro = eval(option.parent);
        }
        if(! Array.isArray(father_aro)){
            let _arr = [];
            for(let objKey in father_aro){
                _arr.push({key:objKey,value:father_aro[objKey]});
            }
            father_aro = _arr;
        }
        let len = father_aro.length;

        Cycling.enabled = true;
        Cycling.TotalCount = Math.ceil(len / every);
        for(let i=0;i*every<=len;++i){
            let _destPrePath = PATH.join(PUBLIC_DIR,item.build.destname);
            destname = PATH.join(_destPrePath, 'index'+destSuffix+'_'+(i+1)+'.html');
            Cycling[option.name] = father_aro.slice(i*every,(i+1)*every);
            Cycling.value = father_aro.slice(i* every, (i+1)* every);
            Cycling.LoopTime = i+1;
            Cycling.PreviousFile = PATH.join(_destPrePath,'index'+destSuffix+'_'+i+'.html');
            Cycling.NextFile = PATH.join(_destPrePath,'index'+destSuffix+'_'+(i+2)+'.html');
            Cycling.FileLocationPrefix = PATH.join(TemplateVariables.ROOT,item.build.destname);
            dbg('Cycl',item.name,JSON.stringify(Cycling[option.name]));
            build_file(FS.readFileSync(filename).toString(), {
                filename,
                ...TemplateVariables,
                ...Sorts,
                Sorts,
                ...inconf_extra,
                ...vars,
                Cycling
            }, destname);
        }
    } else
    build_file(FS.readFileSync(filename).toString(), {
        filename,
        ...TemplateVariables,
        ...Sorts,
        Sorts,
        ...inconf_extra,
        ...vars
    }, destname);
}