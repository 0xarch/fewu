import { writeFile,existsSync } from "fs";

async function createNew(argv){
    const date = new Date();

    const y = date.getFullYear(),
        m = date.getMonth()+1,
        d = date.getDate();

    const m_path = m.toString().padStart(2,0),
        d_path = d.toString().padStart(2,0);
    
    let path = 'posts/'+y+m_path+d_path+'-new.md';
    let path_exist_jump = 0;
    while(existsSync(path)){
        path = 'posts/'+y+m_path+d_path+'-new-'+path_exist_jump+'.md';
        path_exist_jump += 1;
    }

    let tags = argv?.['tag']?.split('+')?.join(' ') ?? '';
    let category = argv?.['category']?.split('+')?.join(' ') ?? '';
    let title = argv?.['title'] ?? 'Blog on '+date.toDateString();
    
    const text = `---
title: ${title}
date: ${y}-${m}-${d}
tags: ${tags}
category: ${category}
---
¯\\_(ツ)_/¯
Write some FOREWORDS here.
After the "more" tag is the content.
<!--more-->`;
    
    writeFile(path,text,{},()=>{});
}

export default createNew;