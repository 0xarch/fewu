const percentRegExp = /<%([\w'#\[\]:\/.@ ]*?)>\n/g;
const variableRegExp = /@([\w.^>]+?)@/g;
const eachRegExp = /<each from="([\w.]+?)"\s*as="([\w]+?)"\s*>/g;
const eachBackRegExp = /<\/each\s*>/g;
const ifRegExp = /<if condition="([\w.=!']+?)"\s*>/g;
const ifBackRegExp = /<\/if\s*>/g;
const includeRegExp = /<include src="([\w\.\/\+\-\:\!]+?)"\s*>/g;

// 非必要请勿使用贪婪模式
const macroExp = /!([\w'\[\] \-]+)((\.(?:[\w]+)\([^;!]*?\))*);/g;
const macroArgExp = /\.(\w+)\(([^;()]+)\)/g;
const innerMacroExp = /\.in\(([^;()]*)\)/;
const contentMacroExp =
  /!([\w'\[\] \-]+)((?:\.(?:[\w]+)\([^;!]*?\))*)\{([^{}]*?)\};?/g;

import * as path from "https://deno.land/std/path/mod.ts";

import Config from "./conf.ts";
const info = Config;
import * as Sort from "./sort.ts";
const DefaultPosts = Sort.DefaultPosts;
const categories = Sort.categories;
const categoryPosts = Sort.categoryPosts;
const RecentPosts = Sort.RecentPosts;
const Posts = Sort.Posts;
const ginfo = {
  postCount: Posts.length,
  cateCount: categories.length,
  cateArr: categories,
};

const layout_dir = `./conf/layout/${info.lookAndFeel.layout}`;
const base_template = parseFile(`${layout_dir}/template.tml`);

function parseFile(filePath: string) {
  let content = Deno.readTextFileSync(filePath);
  content = parse(content, path.parse(filePath).dir);
  return content;
}

function parseTml(name: string) {
  const layout = parseFile(`${layout_dir}/body_${name}.tml`);
  return `${base_template}`.replace(/&layout::body;/g, layout);
}

function percentMacro(contentToParse: string) {
  let content = new String(contentToParse);

  let matches_percent = content.matchAll(percentRegExp);
  // 注意： String.matchAll(...) 返回的是迭代器而不是数组
  for (let match of matches_percent) {
    let text = `<${match[1]}>\n`;
    let rpl = text.replace(/#(\w+?)\[([\w:\/.@ ]+?)\]/g, ' $1="$2"');
    content = content.replace(`<%${match[1]}>\n`, rpl);
  }
  return `${content}`;
  
}

function deMacro(contentToParse: string) {
  let content:String = contentToParse;
  content.match(macroExp); // 我不知道为什么要有这个，但是没有这个跑不起来

  // ;; 宏结尾 => ;<br/>
  content = content.replace(/;;/g, ";<br/>");

  // {}宏
  content = content.replace(contentMacroExp, "!$1$2;$3</$1>");

  let matches_macro = content.matchAll(macroExp);
  for (let match of matches_macro) {
    let text = `<${match[1]}`;
    let vars = match[2];
    // .in()简写
    let inner_contains = innerMacroExp.exec(match[0]);
    if (inner_contains != null) {
      vars = match[2].replace(inner_contains[0], "");
    }
    text += vars.replace(macroArgExp, ' $1="$2"');
    text += ">";
    if (inner_contains != null) {
      text += inner_contains[1];
      text += `</${match[1]}>`;
    }
    content = content.replace(match[0], text);
  }

  content = content.replace(/<\/([\w]+?)'\[[\w -]+?\]>/g, "</$1>");

  if (macroExp.test(`${content}`) || contentMacroExp.test(`${content}`)) {
    content = deMacro(`${content}`);
  }

  return `${content}`;
}

function parseInclude(contentToParse: string, includePath: string) {
  let content:String = contentToParse;
  let matches_include = content.matchAll(includeRegExp);
  for (let match of matches_include) {
    let text = Deno.readTextFileSync(`${includePath}/${match[1]}.tml`);
    text = percentMacro(text);
    text = deMacro(text);
    text = parseInclude(text, includePath);
    content = content.replace(match[0], text);
  }
  return `${content}`;
}

function stringify(X:Array<{}>){
  let content = "[";
  X.forEach(item=>{
    content+=`${JSON.stringify(item)},`;
  });
  content += "]";
  return content;
}

function parseVar(contentToParse:string, extra) {
  let content = contentToParse;

  content = content.replace(/\\@/g, "\u9999uAt\u9999");

  // 替换 @....@ 变量
  content = content.replace(/\u0712([\w.^>]+?)\u0712/g, "\$\{$1\}");

  // each 简写=>...forEach(...=>{...})
  content = content.replace(/<each:([\w.]+?):([\w]+?)>/g, "@$1.forEach($2=>{");
  // 替换 each 标签=>...forEach(...=>{...})
  content = content.replace(eachRegExp, "@$1.forEach($2=>{");
  content = content.replace(eachBackRegExp, "@});");

  // if 简写=>if(...){...}
  content = content.replace(/<if:([\w.=!]+?)>/g, "@if($1){");
  // 替换 if 标签=>if(...){...}
  content = content.replace(ifRegExp, "@if($1){");
  content = content.replace(ifBackRegExp, "@};");

  // 转化为str+=字符串
  content = content.replace(/^([^@]*?)\n/g, "str+=`$1`;\n");
  content = content.replace(/\n([^@]*)/g, "str+=`$1`;\n");
  content = content.replace(/@/g, "");

  content = content.replace(/\u9999uAt\u9999/g, "@");

  // 解构extra中的键值对为变量
  if(extra.post!=undefined){
    content = `const post=${JSON.stringify(extra.post)};` + content;
  }

  let str = "";
  // 在eval中使用解构后的变量
  eval(`${content}`);

  return str;
}

function parse(contentToParse:string, includePath:string) {
  let content = contentToParse;

  // 预转义
  content = content.replace(/\\@/g, "\u9999uAt\u9999")
    .replace(/\\</g, "\u9999uLA\u9999")
    .replace(/\\>/g, "\u9999uRA\u9999")
    .replace(/\\\*/g, "||uS8||")
    .replace(/\\\//g, "||uLL||")
    .replace(/\\\\/g, "||uRL||");

  // 删除注释
  content = content.replace(/\/\*[\S \t]*?\*\//g, "");

  // 宏
  content = deMacro(content);

  // 替换 <%....> 标签
  content = percentMacro(content);

  // include
  content = parseInclude(content, includePath);

  // 去除制表符
  content = content.replace(/\n[\t ]*/g, "\n");

  // 替换 @....@ 变量
  content = content.replace(variableRegExp, "\u0712$1\u0712");

  // 替换class简写
  content = content.replace(/<([\w]+?)'\[([\w -]+?)\]/g, '<$1 class="$2" ');

  // 反转义
  content = content.replace(/\u9999uAt\u9999/g, "@")
    .replace(/\u9999uLA\u9999/g, "<")
    .replace(/\u9999uRA\u9999/g, ">")
    .replace(/\|\|uS8\|\|/g, "*")
    .replace(/\|\|uLL\|\|/g, "/")
    .replace(/\|\|uRL\|\|/g, "\\");

  return content;
}

export { parseFile, parseTml, parseVar };
