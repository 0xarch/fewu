import { writeFile, existsSync, statSync } from "fs";

async function createNew(){
    const AnchorArguments = ['--tag','--category','-t','-c'];
    let args = Array.from(process.argv.slice(3))
        .filter((v,i,a) => !AnchorArguments.includes(v) || (AnchorArguments.includes(v) && !AnchorArguments.includes(a[i+1])));
    let file_location = '', title = '', tags = [], categories = [];
    
    if(args.length === 1){
        title = args[0];
    } else if (args.length === 2){
        if(AnchorArguments.includes(args[0])){
            if([...args[0]].filter(v=>v!='-')[0] === 't'){
                tags.push(args[1]);
            } else {
                categories.push(args[1]);
            }
        } else {
            file_location = args[0];
            title = args[1];
        }
    } else {
        let common_arg = [], tag = [], category = [];
        let in_tag = false, in_category = false;
        for(let i = 0;i<args.length;i++){
            if(args[i] == '--tag' || args[i] == '-t'){
                in_tag = true; in_category = false;
                continue;
            }
            if (args[i] == '--category' || args[i] == '-c') {
                in_category = true; in_tag = false;
                continue;
            }
            if(in_tag) tag.push(args[i]);
            else if (in_category) category.push(args[i]);
            else common_arg.push(args[i]);
        }
        title = common_arg[common_arg.length-1];
        file_location = common_arg[common_arg.length-2];
        tags.push(...tag);
        categories.push(...category);
    }
    
    const date = new Date();

    const y = date.getFullYear(),
        m = date.getMonth()+1,
        d = date.getDate();

    const m_p = m.toString().padStart(2,0),
        d_p = d.toString().padStart(2,0);
    
    let given_is_dir = false;
    if(existsSync('posts/'+file_location)){
        given_is_dir = statSync('posts/'+file_location).isDirectory();
    }
        
    let path = 'posts/' ;
    if (!given_is_dir) path += file_location ?? `${title.toLowerCase().replace(/ /g,'-')}.${m_p}-${d_p}.md`;
    else path += file_location + '/' + `${title.toLowerCase().replace(/ /g,'-')}.${m_p}-${d_p}.md`;

    if(existsSync(path)){
        let path_exist_jump = 0;
        while(existsSync(path + path_exist_jump)){
            path_exist_jump += 1;
        }
        path = path.replace(/([\s\S]*)\.(.*?)$/,`$1_${path_exist_jump}.$2`);
    }

    console.log(path);
    
    const text = `---
title: ${title}
date: ${y}-${m}-${d}
tags: ${tags}
category: ${categories}
---
¯\\_(ツ)_/¯
Write some FOREWORDS here.
After the "more" tag is the content.
<!--more-->`;
    
    writeFile(path,text,{},()=>{});
}

export default createNew;
