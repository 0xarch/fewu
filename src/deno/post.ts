import { marked } from 'https://deno.land/x/marked/mod.ts';
import { ensureDir } from "https://deno.land/std/fs/mod.ts";
import * as path from "https://deno.land/std/path/mod.ts";

const PostDir = "./posts";

async function readPost(filePath:string){
    const content = await Deno.readTextFile(filePath);
    const { data, content:markdownContent } = await parseMarkdown(content);
    const htmlContent = marked.parse(markdownContent);
    const less = extractLess(markdownContent);

    return {
        ...data,
        less,
        content: htmlContent
    }
}

async function readPosts(dir:string){
    ensureDir(dir);
    const posts = Array();

    for ( const file of Deno.readDirSync(dir) ){
        const filePath = path.join(dir,file.name);
        if (!file.isFile){
            posts.push(...await readPosts(filePath));
        } else if( path.basename(file.name,".md") != "about" ){
            posts.push(await readPost(filePath));
        }
    }

    return posts;
}

async function parseMarkdown(content:string){
    const lines = content.split("\n");
    const data = {};
    let i = 0;
  
    if (lines[i] === "---") {
      i++;
      while (lines[i] !== "---") {
        const match = lines[i].match(/^(\w+):\s*(.*)/);
        if (match) {
          data[match[1]] = match[2];
        }
        i++;
      }
      i++;
    }
    data.path=`${data.date.replace(/-/g,"/")}/${data.title.replace(/ /g,"-")}/index.html`;
    data.src=`/${data.date.replace(/-/g,"/")}/${data.title.replace(/ /g,"-")}/`;
  
    const markdownContent = lines.slice(i).join("\n");
  
    return { data, content: markdownContent };
}

function extractLess(markdownContent:string){
    const lines = markdownContent.split("\n");
    const moreIndex = lines.indexOf("<!--more-->");

    if (moreIndex !== -1){
        return marked.parse(lines.slice(0, moreIndex).join("\n").replace(/\#*/g,""));
    } else {
        return marked.parse(lines.slice(0, 5).join("\n").replace(/\#*/g,""));
    }
}

const About = await readPost(`${PostDir}/about.md`);
const Posts = await readPosts(PostDir);

export { About,Posts};