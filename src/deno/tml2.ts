// TML 解析器 v2.0 (TypeScript)
/*
    实验性解析器！
*/
const macroExp_Include = /!?include(?:\.src)?\(([\w\/\\\-.]+)\);?/g;
const tagExp_Include = /<include src="([\w\/\\\-.]+)"\s*?>/g;

const macroExp_All = /!?(\w+)((?:'\[[\w \-]*?\])?)((?:\.\w+?\([^()]+?\))*?)((?:{[^{};]*?};?)|;)/g;

//import * as path from "https://deno.land/std/path/mod.ts";
import Config from "./conf.ts";

import * as Sort from "./sort.ts";
const Sorts = Sort.Sorts;
const info = Config;
const ginfo = {
    postCount: Sort.Posts.length,
    cateCount: Sort.categories.length,
    cateArr: Sort.categories,
};

const includePath = `./conf/layout/${Config.lookAndFeel.layout}`;
const base_template = parseFile(`${includePath}/template.tml`,{});

function include(templateContent:string,includesPath:string){
    let content = new String(templateContent);
    content.match(macroExp_Include);
    let matches_macro = content.matchAll(macroExp_Include);
    for (let match of matches_macro){
        let fileContent = Deno.readTextFileSync(`${includesPath}/${match[1]}.tml`);
        content = content.replace(match[0],fileContent);
    }
    content.match(tagExp_Include);
    let matches_tag = content.matchAll(tagExp_Include);
    for (let match of matches_tag){
        let fileContent = Deno.readTextFileSync(`${includesPath}/${match[1]}.tml`);
        content = content.replace(match[0],fileContent);
    }
    let returnContent = `${content}`;
    if (macroExp_Include.test(returnContent) || tagExp_Include.test(returnContent)){
        returnContent = include(returnContent,includesPath);
    }
    return returnContent;
}

function deMacro(templateContent:string){
    let content = new String(templateContent);
    content = content.replace(/;;/g,";<br/>");
    content.match(macroExp_All); // 别问我为什么，问就是正则抽风
    // Brand new
    let matches = content.matchAll(macroExp_All);
    for ( let match of matches) {
        let text = `<${match[1]}`;
        let element_class = match[2].replace(/'/," class=").replace(/\[|\]/g,"\"");
        let argument = match[3].replace(/\.(\w+?)\(([^()]+?)\)/g," $1=\"$2\"");
        let inner = match[4].replace(/{([^{};]*?)}/g,`>$1</${match[1]}`).replace(";","");
        let close = '>';
        content = content.replace(match[0],`${text}${element_class}${argument}${inner}${close}`);
    }

    let returnContent = `${content}`;

    if (macroExp_All.test(returnContent)){
        returnContent = deMacro(returnContent);
    }
    return returnContent;
}

function deFunction(templateContent:string){
    let content = new String(templateContent);

    // 解析宏
    content = content.replace(/<each:([\w.\-]+?):([\w\-]+?)>/g,"#$1.forEach($2=>{");
    content = content.replace(/<if:([\w.\-]+?)>/g,"#if($1){");

    // 解析函数
    content = content.replace(/<each from="([\w.\-]+?)" as="([\w\-]+?)">/g,"#$1.forEach($2=>{");
    content = content.replace(/<\/each>/g,"#});");
    content = content.replace(/<if is="([\w.\-]+?)"\s*>/g,"#if($1){");
    content = content.replace(/<if condition="([\w.\-]+?)"\s*>/g,"#if($1){");
    content = content.replace(/<\/if>/g,"#}");

    content = content.replace(/\\#/g,"\u8199.Number");
    content = content.replace(/#/g,"\u2005");
    content = content.replace(/\u8199\.Number/g,"\\#");

    let returnContent = `${content}`;
    return returnContent;
}

function render(templateContent:string,extra){
    let content = new String(deFunction(deMacro(include(templateContent,includePath))));
    content = content.replace(/(?:\n|^)([^\u2005{}]*)/g,"\nstr+=`$1`;");
    content = content.replace(/\u2005/g,"");
    content = content.replace(/@([\w.\-]+?)@/g,"\${$1}");
    if (extra.post!=undefined){
    content = `const post=${JSON.stringify(extra.post)};` + content;
    }
    let str="";
    eval(`${content}`);
    return str;
}

function parseFile(filePath: string,extra) {
    let content = Deno.readTextFileSync(filePath);
    content = render(content, extra);
    return content;
  }
  
function parseTml(name: string,extra) {
    const layout = parseFile(`${includePath}/body_${name}.tml`,extra);
    return `${base_template}`.replace(/&layout::body;?/g, layout);
}

//render(Deno.args[0],{});

export { render, parseFile, parseTml };