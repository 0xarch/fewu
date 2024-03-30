import { writeFile,existsSync } from "fs";

const date = new Date();

const y = date.getFullYear(),
    m = date.getMonth()+1,
    d = date.getDate();

let path = 'posts/'+y+m+d+'-new.md';
let path_exist_jump = 0;
while(existsSync(path)){
    path = 'posts/'+y+m+d+'-new-'+path_exist_jump+'.md';
    path_exist_jump += 1;
}

const text = `---
title: 
date: ${y}-${m}-${d}
tags: 
category: 
---
¯\\_(ツ)_/¯
Write some FOREWORDS here.
After the "more" tag is the content.
<!--more-->`;

writeFile(path,text,{},()=>{});