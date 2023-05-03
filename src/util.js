const fs = require("fs");
const copy = require("node-fs-extra").copy;
const date = new Date();
const y=date.getFullYear(),m=("0" + (date.getMonth() + 1)).slice(-2),d=("0" + date.getDate()).slice(-2);

function newPost(){
    let content = 
`---
title: ${process.argv[3]}
date: ${y}-${m}-${d}
category: 暂无
---

# Write something here!`;

    fs.writeFile(`./posts/${process.argv[3]}.md`,content,(err)=>{if(err)throw err});
}
function log2md(){
    const os = require("os");
    const path =require("path");
    const filePath = path.parse(process.argv[3]);
    var content = fs.readFileSync(process.argv[3],(err)=>{
        if(err) throw err;
        else console.log(`<Success> Read file from ${filePath}`);
    }).toString();
    let lines = content.replace(/\*/g,"\*").split("\n");
    content = 
`---
title: ${filePath.name}
date: ${y}-${m}-${d}
category: 日志
---
CPU: ${os.cpus()[0].model}

MEM: ${os.totalmem()}(Bytes)

OS: ${os.arch()}, ${os.type()} ${os.release()}

${lines.join("\n\n")}`;

    fs.writeFile(`./posts/${filePath.name}.md`,content,(err)=>{
        if(err) throw err;
        else console.log(`<Success> Wrote file to ./posts/${filePath.name}.md`);
    });
}
function build(){
    const proc = require("./proc");

    const PublicDir=proc.PublicDir;

    proc.build("index",{},`${PublicDir}/index.html`);
    proc.build("archive",{},`${PublicDir}/archive/index.html`);
    proc.build("category",{},`${PublicDir}/category/index.html`);
    proc.build("about",{post:proc.about},`${PublicDir}/about/index.html`);
    
    proc.posts.forEach(item => {
        proc.build("post",{post:item},`${PublicDir}/${item.path}`);
    });
    
    copy(proc.ThemeDir,`${PublicDir}/css`,(err)=>{if(err)throw err});
}
function helpme(){
    console.log(`
可用参数：
new {
    new title
    创建一个新文档，标题为title，存放在./posts目录下
}
build {
    build
    生成静态页面
}
log2md {
    log2md filePath
    从filePath读取日志并转为markdown文档，存放在./posts目录下
}
help {
    help
    显示本页面
}
默认 = build
    `);
    console.log(`
--------------------------
Hogger v0.3.5
Based on Node.js
2023 0xarch
https://github.com/0xarch/
--------------------------
    `);
}
function arg_process(){
    const arg = process.argv[2];
    if(arg == "new") newPost();
    else if(arg == "build") build();
    else if(arg == "log2md") log2md();
    else if(arg == "help") helpme();
    else build();
}
exports.main=()=>arg_process();