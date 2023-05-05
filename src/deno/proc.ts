import Config from "./conf.ts";
import * as Path from "https://deno.land/std/path/mod.ts";
import * as tml2 from "./tml2.ts";
import * as match from "./match.ts";
import * as Sort from "./sort.ts";
import { ensureDirSync } from "https://deno.land/std/fs/mod.ts";
import { copy } from "https://deno.land/std@0.185.0/fs/copy.ts";
const Posts = Sort.DefaultPosts;
const About = Sort.About;
const info = Config;

const PublicDir="./public";
const ThemeDir=`./conf/theme/${info.lookAndFeel.theme}`;
const LayoutDir=`./conf/layout/${info.lookAndFeel.layout}`;

async function build(type:string,extra,path:string){
    console.log(`<Progress> Building [${type}] to ${path}`);
    let content = tml2.parseTml(type,extra);
    if(extra.post==undefined)content = match.parseBuiltin(content,type,undefined);
    else content = match.parseBuiltin(content,type,extra.post.title);
    ensureDirSync(Path.dirname(path));
    Deno.writeTextFile(`${path}`,content);
}

function main() {
    build("index",{},`${PublicDir}/index.html`);
    build("archive",{},`${PublicDir}/archive/index.html`);
    build("category",{},`${PublicDir}/category/index.html`);
    build("post",{post:About},`${PublicDir}/about/index.html`);
    Posts.forEach(item=>{
      build("post",{post:item},`${PublicDir}/${item.path}`);
    });
    copy(ThemeDir,`${PublicDir}/css`,{overwrite:true});
  }

export{PublicDir,ThemeDir,LayoutDir,build,Posts,About,main};