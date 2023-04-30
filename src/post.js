const path = require("path");
const marked = require("marked");
const fs = require("fs");

const CONF=require("./conf.js").CONF;

const LOG = console.log;

const POSTS_DIR = "./posts";

const EXT_DIR = "./conf/layout/extensions";

const extensions = CONF.features.thirdSideExtensions;
let extContent = "";

extensions.forEach(extension => {
    const fileName = `${EXT_DIR}/${extension}.ejs`;
    if (fs.existsSync(fileName)) {
      const fileContent = fs.readFileSync(fileName).toString();
      combinedContent += fileContent;
    } else {
      LOG(`<File does not exist> Extension file ${fileName}`);
    }
  });

exports.extensions=extContent;

function readPost(filePath){
  const content = fs.readFileSync(filePath, "utf-8",(err)=>{
    if(err){
      LOG(`<Error> Met an error while reading [${filePath}]`);
    }});
  const { data, content: markdownContent } = parseMarkdown(content);
  const htmlContent = marked.parse(markdownContent);
  const less = extractLess(markdownContent);

  return {
    ...data,
    less,
    content: htmlContent,
  };
}

function readPosts(dir) {
  fs.access(dir,(err)=>{
    if(err){
      LOG("<Failed> Met an error while reading post directory, [<Try> mkdir]");
    }
  });
  const files = fs.readdirSync(dir);
  const posts = Array();

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      posts.push(...readPosts(filePath));
    } else if (path.extname(file) === ".md" && path.basename(file,".md") != "about" ) {
      posts.push(readPost(filePath));
    }
  }

  return posts;
}

function parseMarkdown(content) {
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

function extractLess(markdownContent) {
  const lines = markdownContent.split("\n");
  const moreIndex = lines.indexOf("<!--more-->");

  if (moreIndex !== -1) {
    return marked.parse(lines.slice(0, moreIndex).join("\n").replace(/\#*/g,""));
  } else {
    return marked.parse(lines.slice(0, 5).join("\n").replace(/\#*/g,""));
  }
}


const ABOUT = readPost(`${POSTS_DIR}/about.md`);
const POSTS = readPosts(POSTS_DIR);

exports.ABOUT = ABOUT;
exports.POSTS = POSTS;
