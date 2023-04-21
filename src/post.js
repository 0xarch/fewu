const path = require("path");
const marked = require("marked");
const fs = require("fs");
const STATIC = require("./static");
const CONF = require("./conf").CONF;

const POSTS_DIR = "./posts";
const WIDGET_DIR = `./conf/layout/${CONF.lookAndFeel.layout}/widgets`;
const EXT_DIR = "./conf/layout/extensions";

const extensions = CONF.features.thirdSideExtensions;
let extContent = "";

extensions.forEach(extension => {
    const fileName = `${EXT_DIR}/${extension}.ejs`;
    if (fs.existsSync(fileName)) {
      const fileContent = fs.readFileSync(fileName).toString();
      combinedContent += fileContent;
    } else {
      console.log(`Extension file ${fileName} does not exist`);
    }
  });

exports.extensions=extContent;

const sortBy = (array, field, sort = "asc") => {
  const sortOpt = {
      asc: (a, b, sortField) => a[sortField] - b[sortField],
      desc: (a, b, sortField) => b[sortField] - a[sortField],
  };
  array.sort((a, b) => sortOpt[sort](a, b, field));
  return array;
};

function readPost(filePath){
  const content = fs.readFileSync(filePath, "utf-8");
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
  const files = fs.readdirSync(dir);
  const posts = [];

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      posts.push(...readPosts(filePath));
    } else if (path.extname(file) === ".md" && path.basename(file,".md") != "about" ) {
      const content = fs.readFileSync(filePath, "utf-8");
      const { data, content: markdownContent } = parseMarkdown(content);
      const htmlContent = marked.parse(markdownContent);
      const less = extractLess(markdownContent);

      posts.push({
        ...data,
        less,
        content: htmlContent,
      });
    }
  }

  return sortBy(posts,"date");
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

function insertItems(content) {
  var content = content;
  // Use a regular expression to match the format <%! widget:key !%> in the content
// and extract the key
  const widgetRegex = /<%! widget:(\w+) !%>/g;
  const widgetKeys = [];
  let match;
  while ((match = widgetRegex.exec(content)) !== null) {
    widgetKeys.push(match[1]);
  }

  // Loop through the widget keys and replace the corresponding <%! widget:key !%> 
  // in the content with the contents of the key.ejs file in WIDGET_DIR
  for (const key of widgetKeys) {
    const widgetContent = fs.readFileSync(`${WIDGET_DIR}/${key}.ejs`, "utf-8");
    content = content.replace(`<%! widget:${key} !%>`, widgetContent);
  }

  content = content.replace(/<%! extensions !%>/g,extContent);
  return content;
}

const ABOUT = readPost(`${POSTS_DIR}/about.md`);
const POSTS = readPosts(POSTS_DIR);

exports.ABOUT = ABOUT;
exports.POSTS = POSTS;
exports.insertItems=(content)=>insertItems(content);