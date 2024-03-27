import { writeFile } from "fs";

const date = new Date();

const y = date.getFullYear(),
    m = date.getMonth()+1,
    d = date.getDate();

const path = 'posts/'+y+m+d+'-new.md';

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