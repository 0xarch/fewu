const args = Deno.args;

const date = new Date();
const y = date.getFullYear(),
  m = ("0" + (date.getMonth() + 1)).slice(-2),
  d = ("0" + date.getDate()).slice(-2);

import * as proc from "./proc.ts";

function main() {
  if (args[0] == "new") newPost();
  else if (args[0] == "build") build();
  else if (args[0] == "log2md") log2md();
  else if (args[0] == "help") helpme();
  else build();
}

function newPost() {
  let content = `---
title: ${args[1]}
date: ${y}-${m}-${d}
category: 暂无
---
# Write Something Here!`;
  const encoder = new TextEncoder();
  const data = encoder.encode(content);
  Deno.writeFile(`./posts/${args[1]}.md`, data);
}
function log2md() {}
function build() {
  const PublicDir=proc.PublicDir;
  proc.build("index",{},`${PublicDir}/index.html`);
  proc.build("archive",{},`${PublicDir}/archive/index.html`);
  proc.build("category",{},`${PublicDir}/category/index.html`);
  proc.build("post",{post:proc.About},`${PublicDir}/about/index.html`);
  proc.Posts.forEach(item=>{
    proc.build("post",{post:item},`${PublicDir}/${item.path}`);
  });
}
function helpme() {}

export default main;
