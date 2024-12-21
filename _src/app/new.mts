import { writeFile, existsSync, statSync } from "fs";
import StandaloneApp from "#util/ts/StandaloneApp";
import Argv from "#util/ts/Argv";

const app = new StandaloneApp({
    version: '2.0.0',
    name: 'io.fewu.createNew'
});

async function App(){
    console.info(app.humanize());

    // const [title, file_location]: [string,string?] = (Argv['--new'] as string[]).reverse();
    const title = (Argv['--new'] as string[]).reverse()[0];
    const file_location = (Argv['--new'] as string[]).reverse()[1];
    const tags: string[] = Array.from<string>(Argv['-t'] ?? []).concat(...Array.from<string>(Argv['--tag'] ?? []));
    const categories: string[] = Array.from<string>(Argv['-c'] ?? []).concat(...Array.from<string>(Argv['--category'] ?? []));

    const date = new Date();

    const y = date.getFullYear(),
        m = date.getMonth()+1,
        d = date.getDate();

    const m_p = m.toString().padStart(2,'0'),
        d_p = d.toString().padStart(2,'0');
    
    let given_is_dir = false;
    if(existsSync('posts/'+file_location)){
        given_is_dir = statSync('posts/'+file_location).isDirectory();
    }
        
    let path = 'posts/' ;
    if (!given_is_dir) path += file_location ?? `${title.toLowerCase().replace(/ /g,'-')}.${m_p}-${d_p}`;
    else path += file_location + '/' + `${title.toLowerCase().replace(/ /g,'-')}.${m_p}-${d_p}`;

    if(existsSync(path)){
        let path_exist_jump = 0;
        while(existsSync(path + path_exist_jump + '.md')){
            path_exist_jump += 1;
        }
        path = path.replace(/([\s\S]*)\.(.*?)$/,`$1_${path_exist_jump}.md`);
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

export default App;
