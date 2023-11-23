const Path = require('path');
const Hail = require('../modules/lib/hail');
const Hug = require('../modules/lib/hug');
const Optam = require('../modules/lib/optam');
const Sort = require('../sort'); // 过时的
const builder = require('../modules/app/builder');
Hug.log("开始","主任务");

function main(){
    const argv = Hug.gopt(process.argv);
    const GlobalConfig = JSON.parse(Hail.readFile(argv['config']));

    Hug.log("完成","读取配置文件");
    if(argv['dry-run'] == 'null'){
        process.exit();
    }

    const ThemeName = GlobalConfig.theme.name;

    const PostDir = GlobalConfig.build.post_directory,
        ThemeDir = Path.join('themes',ThemeName),
        ThemeLayoutDir = Path.join('themes',ThemeName,'layouts'),
        ThemeFilesDir = Path.join('themes',ThemeName,'files'),
        PublicDir = GlobalConfig.build.public_directory;

    const ThemeConfig = JSON.parse(Hail.readFile(ThemeDir,'config.json'));
    const ThemeLayoutType = ThemeConfig.layout.type;

    if(PostDir == undefined ) PostDir = "posts";
    if(PublicDir == undefined) PublicDir = "public";

    if(argv['dry-run'] == 'config'){
        Hug.log(JSON.stringify(GlobalConfig));
        Hug.nextline();
        Hug.log(JSON.stringify(ThemeConfig));
        process.exit();
    }

    const {Posts,Specials} = Optam.ReadPosts(PostDir,GlobalConfig.excluded_posts);
    const Sorts = Sort.getSort(Posts);

    const BuildVariables = {
        Posts,
        Sorts,
        GlobalConfig,
        user: GlobalConfig.user,
        Appearance: GlobalConfig.appearance,
        ROOT: !["/", "", undefined].includes(GlobalConfig.build.site_root) ? GlobalConfig.build.site_root : ''
    }

    for (let item of ThemeConfig.layout.layouts) {
        let filename = Path.join(ThemeLayoutDir, item.build.filename),
            destname = Path.join(PublicDir, item.build.destname, 'index.html');
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
            Hug.dbg('Varia',item.name);
            let Varias = {};
            let option = item.build.option.varias;
            let parent_var = eval(option.parent);
            Varias.enabled = true;
            for(let var_name in parent_var){
                const destSuffix='_'+var_name;
                destname = Path.join(PublicDir, item.build.destname, 'index'+destSuffix+'.html');
                Varias.keyName = var_name;
                Varias.value = parent_var[var_name];
                const _W_vars = {Varias};
                BF_with(_W_vars,item,filename,destname,inconf_extra,destSuffix);
            }
        } else
        BF_with({},item,filename,destname,inconf_extra);
    }
    Hug.log("开始","搭建所有文件");
    let postFilename = Path.join(ThemeLayoutDir,ThemeConfig.layout.post_layout);
    let postTemplate = Hail.readFile(ThemeLayoutDir,ThemeConfig.layout.post_layout);
    
    Posts.forEach(item => {
        let destname = Path.join(PublicDir, item.path);
        builder.build(ThemeLayoutType,postTemplate,{
            post: item,
            filename: postFilename,
            ...BuildVariables,
            ...Sorts
        },destname);
    })
    Hail.copyFile(ThemeFilesDir,Path.join(PublicDir,'files'));
    
    async function BF_with(vars,item,filename,destname,inconf_extra,destSuffix=''){
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
            
            Hug.log('Cycl',item.name);
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
                let _destPrePath = Path.join(PublicDir,item.build.destname);
                destname = Path.join(_destPrePath, 'index'+destSuffix+'_'+(i+1)+'.html');
                Cycling[option.name] = father_aro.slice(i*every,(i+1)*every);
                Cycling.value = father_aro.slice(i* every, (i+1)* every);
                Cycling.LoopTime = i+1;
                Cycling.PreviousFile = Path.join(_destPrePath,'index'+destSuffix+'_'+i+'.html');
                Cycling.NextFile = Path.join(_destPrePath,'index'+destSuffix+'_'+(i+2)+'.html');
                Cycling.FileLocationPrefix = Path.join(BuildVariables.ROOT,item.build.destname);
                Hug.dbg('Cycl',item.name,JSON.stringify(Cycling.value));
                builder.build(ThemeLayoutType,Hail.readFile(filename),{
                    filename,
                    ...BuildVariables,
                    ...Sorts,
                    ...inconf_extra,
                    ...vars,
                    Cycling
                },destname);
            }
        } else
        builder.build(ThemeLayoutType,Hail.readFile(filename),{
            filename,
            ...BuildVariables,
            ...Sorts,
            ...inconf_extra,
            ...vars
        }, destname)
    }
}

exports.App = main;