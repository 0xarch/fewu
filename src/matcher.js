const fs = require("fs");
const ejs = require("ejs");
const CONF = require("./conf.js").CONF;
const LOG = console.log;
const LAYOUT_DIR = `./conf/layout/${CONF.lookAndFeel.layout}`;
const WIDGET_DIR = `${LAYOUT_DIR}/widgets`;
const EXT_DIR = "./conf/extensions";
const LAYOUT_BASE = fs.readFileSync(`${LAYOUT_DIR}/base.ejs`);

const SORT = require("./sorter.js");
const POSTS = SORT.DEFAULT_POSTS;
const DATE_POSTS = SORT.DATE_POSTS;
const RECENT_POSTS = SORT.RECENT_POSTS;
const CATEGORY_POSTS = SORT.CATEGORY_POSTS;

const extensions = CONF.features.thirdSideExtensions;
let extContent = "";

extensions.forEach(extension => {
    const fileName = `${EXT_DIR}/${extension}.ejs`;
    if (fs.existsSync(fileName)) {
      const fileContent = fs.readFileSync(fileName).toString();
      extContent += fileContent;
    } else {
      LOG(`<File does not exist> Extension file ${fileName}`);
    }
});

/*
    本处代码为 Hogger 的 EJS模板 提供了widgets的include简写支持
    例如：
        对于一个主题，其目录像这样：
        Name
        | - widgets
        |   | - some.ejs
        |   | - ...
        | - index.ejs
        | - ...
        在index.ejs中插入some.ejs模板可以被写为：
            <%! widget:some !%>
        等价于 EJS 的 include()

*/
function parseWidget(content) {
    const widgetRegex = /<%! widget:(\w+) !%>/g;
    const widgetKeys = [];
    let match;
    while ((match = widgetRegex.exec(content)) !== null) {
      widgetKeys.push(match[1]);
    }
    const widgetContents = {};
    widgetKeys.forEach(key=>{
        widgetContents[key]=fs.readFileSync(`${WIDGET_DIR}/${key}.ejs`, "utf-8");
    });

    for (const key of widgetKeys) {
      content = content.replace(`<%! widget:${key} !%>`, widgetContents[key]);
    }

    if ( widgetRegex.test(content) )
        content = parseWidget(content);

    content = content.replace(/<%! layout:extensions !%>/g,extContent);
    return content;
}

/*
    本处代码为 Hogger 的 EJS模板 提供了独特的class简写和奇异CSS支持

    class简写：
        例如：
            <div class="foo bar">
        可以被写成
            <div.foo.bar>
        也可以是
            <div [foo bar]>
        注意：
            前者只能书写简略元素(只有class的元素)，后者可以书写普通元素(带有其他属性的元素)
            例如：
                <a class="foo" href="/bar">
            可以使用后者，看上去像
                <a [foo] href="/bar">
    奇异CSS:
        例如:
            class="flexRow flexAlignCenter" class="flexColumn flexAlignCenter flexJustifyCenter"
        可以被书写为：
            class=":fR_fAC" class=":fR_fAJC"
        你可以通过在 <DEFINE> 标记的地方添加replace来使用自己的奇异CSS
*/
function parseCSS(content){
    var content = content.replace(/<([^.^\/^ ^>]*?)\.([^>^"]*?)>/g,'<$1 class="$2">');
    content = content.replace(/<([^ ^<^\/^@]*?)\s*?\[([\s\S]*?)\]\s*?(.*?)?>/g,'<$1 class="$2" $3>');
    content = content.replace(/<([^ ^<^\/^@]*?)\s*?\[([\s\S]*?)\]\s*?(.*?)?\/>/g,'<$1 class="$2" $3/>');
    const classRegex= /class="([\s\S]*?)"/g;
    const classes = [];
    let match;
    while ((match = classRegex.exec(content)) !== null) {
        classes.push(match[1]);
    }
    for (const key of classes) {
        // <DEFINE>
        const c = key.replace(':fR_',' flexRow :').replace(':fC_',' flexColumn :').replace(':fI_',' flexItem :')
                     .replace(':fJC','flexJustifyCenter').replace(':fAC','flexAlignCenter').replace(':fAJC','flexAlignCenter flexJustifyCenter')
                     .replace(':mw',' marginLeft marginRight').replace(':mh',' marginTop marginBottom')
                     .replace(/\./g," ");
        content = content.replace(`class="${key}"`,`class="${c}"`);
    }
    return content;
}

/*
    TODO: 内置特殊函数简写支持 (基于全能的.replace)
    1. forEach支持
        例如：
            <each (foo~bar) >
                <%! doc:foobar !%> // 此处的widget暂时不是我们关心的
            </each>
        等价于
            <% foo.forEach(bar=>{ -%>
                <%! doc:foobar !%>
            <% }) -%>
        格式：
            <each (val~key) >
                <!--content-->
            </each >
            其中val为数组名，key为在forEach中使用的子元素名，<!--content-->为forEach中的内容，
    2. <%= -%> / <%- -%>
        例如：
            <@foo.bar>
            <@-foo.bar>
        等价于
            <%= foo.bar -%>
            <%- foo.bar -%>
        
*/
function parseFunction(content){
    var content = content;
    content = content.replace(/<each\s*\(([\w.]+?)~([^~]+?)\)\s*>/g,"<% $1.forEach($2=>{ -%>").replace(/<\/each\s*>/g,"<% }) -%>")
    .replace(/<@([\w.]+)\s*>/g,"<%= $1 -%>").replace(/<@\-([\w.]+)\s*>/g,"<%- $1 -%>");
    return content;
}

function parseLayout(filePath) {
    const content = fs.readFileSync(filePath).toString();
    return `${LAYOUT_BASE}`
    .replace(/<%! layout:body !%>/g,content);
}

function parseBuiltin(content,layoutType,post) {
    let TitlePrefix="",TitleSeperator="",TitleSuffix,Features="";
    switch (layoutType){
        case "archive":{
            TitlePrefix = "归档";
            break }
        case "category":{
            TitlePrefix = "分类";
            break }
        case "post":{
            TitlePrefix = post.title;
            break }
        case "about":{
            TitlePrefix = "关于";
            break }
    }
    if (layoutType != "index") TitleSeperator= ` ${CONF.lookAndFeel.customSeperator} `;
    if ( CONF.lookAndFeel.customSiteTitle != undefined || CONF.lookAndFeel.customSiteTitle != "none" ) {
        TitleSuffix = CONF.lookAndFeel.customSiteTitle;
    } else {
        TitleSuffix = `${CONF.name}'s Blog`;
    }
    if ( CONF.features.enableCodeHighlight )
        Features+="<link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css'>"+
        "<script src='//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js'></script>"+
        "<script>hljs.highlightAll()</script>";
    content = content
    .replace(/<%! builtin:title !%>/g,`<title>${TitlePrefix}${TitleSeperator}${TitleSuffix}</title>`)
    .replace(/<%! builtin:siteTitle !%>/g,TitleSuffix)
    .replace(/<%! builtin:features !%>/g,Features);
    return parseCSS(content);
}

function autoParseLayout(filePath){
    const ret=parseFunction(parseWidget(parseLayout(filePath)));
    console.log(ret);
    return ret;
}

exports.parseWidget=(filePath)=>parseWidget(filePath);
exports.parseLayout=(filePath)=>parseLayout(filePath);
exports.parseCSS=(content)=>parseCSS(content);
exports.autoParseLayout=(filePath)=>autoParseLayout(filePath);
exports.parseBuiltin=(content,layoutType,post)=>parseBuiltin(content,layoutType,post);