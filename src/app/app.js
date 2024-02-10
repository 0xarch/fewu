import * as Hail from '../modules/lib/hail.js';
import * as Hug from '../modules/lib/hug.js';
import * as Optam from '../modules/lib/optam.js';
import * as fs from 'fs';
import * as Path from 'path';
import { errno,run } from '../lib/mod.js';
import { build_and_write } from '../modules/app/builder.js';
import { Worker } from 'worker_threads';
/**
 * @DOCUMENT_OF_APP
 * @argument config Configuration file for Nexo.
 * @argument theme Use specified theme.
 * 
 * **NOTE** Working in progress
 */
async function App(){
    const argv = Hug.gopt(process.argv);
    let config_raw_text = fs.readFileSync(argv['config'] || 'config.json').toString();
    const GlobalConfig = JSON.parse(config_raw_text);
    const isDebugMode = argv['debug'];

    Hug.log("完成","读取配置文件");
    if(argv['dry-run'] == 'null'){
        process.exit();
    }

    const ThemeName = argv['theme'] || GlobalConfig.theme.name;

    const PostDir = GlobalConfig.build.post_directory,
        ThemeDir = Path.join('themes',ThemeName),
        ThemeLayoutDir = Path.join('themes',ThemeName,'layouts'),
        ThemeFilesDir = Path.join('themes',ThemeName,'files'),
        PublicDir = GlobalConfig.build.public_directory;

    const ThemeConfig = JSON.parse(Hail.readFile(ThemeDir,'config.json'));
    const ThemeLayoutType = ThemeConfig.layout.type;

    if(!PostDir) PostDir = "posts";
    if(!PublicDir) PublicDir = "public";

    if(argv['dry-run'] == 'config'){
        console.log(JSON.stringify(GlobalConfig));
        Hug.nextline();
        console.log(JSON.stringify(ThemeConfig));
        process.exit();
    }

    if(argv['only'] == 'updateTheme'){
        let _ = await part_copyfiles(ThemeFilesDir,PublicDir,ThemeConfig);
        console.log(_);
        process.exit();
    }

    const {Posts,Specials} = Optam.ReadPosts(PostDir,GlobalConfig.excluded_posts);
    const Sorts = Optam.getSort(Posts);

    Specials;

    let __public_root = !["/", "", undefined].includes(GlobalConfig.build.site_root) ? GlobalConfig.build.site_root : '';

    const BuildVariables = {
        Posts,
        Sorts,
        GlobalConfig,
        user: GlobalConfig.user,
        theme: GlobalConfig.theme.options,
        Appearance: GlobalConfig.appearance,
        ROOT: __public_root
    }

    let __plugin;
    let __get_title = (function(){
        let sep = '|';
        if(GlobalConfig.theme.title){
            if(GlobalConfig.theme.title.separator)
                sep = GlobalConfig.theme.title.separator;
            return (fix,type)=>{
                let suffix=type;
                if(GlobalConfig.theme.title[type])
                    suffix = GlobalConfig.theme.title[type];
                return fix+' '+sep+' '+suffix;
            }
        }
        return (fix,type)=>{
            return fix+' '+sep+' '+type;
        }
    })();

    /**
     * @param { string } file_dir 
     * @returns string
     */
    function __get_file_relative_dir(file_dir){
        if(!file_dir) return __public_root+'/';
        if(file_dir[0]=='/')
            file_dir = file_dir.substring(1)
        return __public_root+"/"+file_dir;
    }

    if(ThemeConfig.API){
        /**
         * @DOCUMENT_OF_PLUGIN
         * set %ThemeConfig.API.hasPlugin% to true to enable plugin
         * The plugin must be located at% Theme%/extra/plugin.js 
         * and provide a plugin() method. 
         * The App will call the plugin() method
         * and pass the result to the template with the name 'Plugin'
         * 
         * @example const plugin = () => '000' ; EJS'<%=Plugin-%>' ~> 000
         */
        if(ThemeConfig.API.hasPlugin){
            let __plugin_file = fs.readFileSync(Path.join(ThemeDir,'extra/plugin.js'));
            let __plugin_script = 'try{\n'+__plugin_file.toString()+'\nplugin()}catch(e){errno(20202);console.error(e);"NULL"}';
            __plugin = eval(__plugin_script);
        }
    }

    function resolve(filename){
        if(ThemeConfig.API && ThemeConfig.API.provideWith && ThemeConfig.API.provideWith!="v1"){
            switch(ThemeConfig.API.provideWith){
                case "v2":
                    return {
                        Plugin:__plugin,
                        allArticles: Posts,
                        sortArticle: Sorts,
                        ID: Sorts.BID,
                        settings: GlobalConfig,
                        theme: GlobalConfig.theme.options,
                        user: GlobalConfig.user,
                        __root_directory__: __public_root,
                        __filename__: filename,
                        __title__: __get_title,
                        file: __get_file_relative_dir,
                    }
            }
        } else {
            return {
                Posts,
                Sorts,
                GlobalConfig,
                user: GlobalConfig.user,
                theme: GlobalConfig.theme.options,
                Appearance: GlobalConfig.appearance,
                ROOT: __public_root,
                ...Sorts
            }
        }
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
                inconf_extra['Varias'] = Varias;
                BF_with(_W_vars,item,filename,destname,inconf_extra,destSuffix);
            }
        } else
        BF_with({},item,filename,destname,inconf_extra);
    }
    let postFilename = Path.join(ThemeLayoutDir,ThemeConfig.layout.post_layout);
    let postTemplate = fs.readFileSync(postFilename).toString();
    
    part_build_page(ThemeLayoutType,postTemplate,Posts,PublicDir,ThemeConfig,{
        basedir:ThemeLayoutDir,
        filename:postFilename
    },{
        ...resolve(postFilename)
    });
    part_copyfiles(ThemeFilesDir,PublicDir,ThemeConfig);


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
            let Cycling = {};
            let option = item.build.option.cycling;
            // aro stands for "array or object"
            let father_aro = [], every = option.every;
            (function(){
                let __splited = option.parent.split(".");
                if(__splited.length == 1) father_aro = eval(__splited[0]);
                else {
                    let __tempor_val;
                    try{
                        __tempor_val = eval(__splited[0]);
                    }catch(_){
                        try{
                            __tempor_val = inconf_extra[__splited[0]];
                        }catch(_){
                            errno('30001');
                        }
                    }
                    for(let z=1;z<__splited.length;z++){
                        __tempor_val = __tempor_val[__splited[z]];
                    }
                    father_aro = __tempor_val;
                }
            }());
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
                build_and_write(ThemeLayoutType,Hail.readFile(filename),{
                    basedir:ThemeLayoutDir,
                    filename
                },{
                    ...resolve(),
                    ...inconf_extra,
                    ...vars,
                    Cycling
                },ThemeConfig,destname);
            }
        } else
        build_and_write(ThemeLayoutType,fs.readFileSync(filename).toString(),{
            basedir: ThemeLayoutDir,
            filename
        },{
            ...resolve(),
            ...inconf_extra,
            ...vars
        },ThemeConfig,destname);
    }
}

async function part_copyfiles(themeFileDir,publicDir,ThemeConfig){
    await Hail.copyFile(themeFileDir,Path.join(publicDir,'files'));
    await Hail.copyFile('sources',Path.join(publicDir,'sources'));
    if(ThemeConfig.rawPosts && ThemeConfig.rawPosts.copy){
        if(ThemeConfig.rawPosts.copyTo){
            Hail.copyFile('posts',Path.join(publicDir,ThemeConfig.rawPosts.copyTo));
        } else {
            errno('20101');
        }
    }
    console.log('Copy Complete');
}

async function part_build_page(layoutType,template,Posts,publicDir,ThemeConfig,options,GivenVariables){
    Posts.forEach(item => {
        let destname = Path.join(publicDir, item.path);
        build_and_write(layoutType,template,options,{
            post:item,
            ...GivenVariables
        },ThemeConfig,destname);
    })
}

export default App;
