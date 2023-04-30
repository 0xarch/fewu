const fs = require("fs");
const CONF = require("./conf.js").CONF;
const LAYOUT_DIR = `./conf/layout/${CONF.lookAndFeel.layout}`;
const WIDGET_DIR = `${LAYOUT_DIR}/widgets`;
const EXT_DIR = "./conf/extensions";
const LAYOUT_BASE = fs.readFileSync(`${LAYOUT_DIR}/base.ejs`);

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

function parseWidget(content) {
    const widgetRegex = /<%! widget:(\w+) !%>/g;
    const widgetKeys = [];
    let match;
    while ((match = widgetRegex.exec(content)) !== null) {
      widgetKeys.push(match[1]);
    }
    for (const key of widgetKeys) {
      const widgetContent = fs.readFileSync(`${WIDGET_DIR}/${key}.ejs`, "utf-8");
      content = content.replace(`<%! widget:${key} !%>`, widgetContent);
    }

    return parseCSS(content);
}

function parseCSS(content){
    const classRegex= /class="([\s\S]*?)"/g;
    const classes = [];
    let match;
    while ((match = classRegex.exec(content)) !== null) {
        classes.push(match[1]);
    }
    for (const key of classes) {
        const c = key.replace(':fR_',' flexRow :').replace(':fC_',' flexColumn :').replace(':fI_',' flexItem :')
                     .replace(':fJC','flexJC').replace(':fAC','flexAC').replace(':fAJC','flexACJC')
                     .replace(':mw',' marginLeft marginRight').replace(':mh',' marginTop marginBottom')
                     ;
        content = content.replace(`class="${key}"`,`class="${c}"`);
    }
    return content
    .replace(/_acs_:ml([^"^ ]*?)/g,"marginLeft _acs_:m$1")
    .replace(/_acs_:mt([^"^ ]*?)/g,"marginTop _acs_:m$1")
    .replace(/_acs_:mr([^"^ ]*?)/g,"marginRight _acs_:m$1")
    .replace(/_acs_:mb/g,"marginBottom");
}

function parseLayout(filePath) {
    const content = fs.readFileSync(filePath).toString();
    return `${LAYOUT_BASE}`
    .replace("<%! layout:body !%>",content);
}

function parseBuiltin(content,layoutType,post) {
    let TitlePrefix="",TitleSeperator="",TitleSuffix;
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
    return content
    .replace(/<%! builtin:title !%>/g,`${TitlePrefix}${TitleSeperator}${TitleSuffix}`)
    .replace(/<%! builtin:siteTitle !%>/g,TitleSuffix)
    .replace(/<%! builtin:extensions !%>/g,extContent);
}

function autoParseLayout(filePath){
    return parseWidget(parseLayout(filePath));
}

exports.parseWidget=(filePath)=>parseWidget(filePath);
exports.parseLayout=(filePath)=>parseLayout(filePath);
exports.autoParseLayout=(filePath)=>autoParseLayout(filePath);
exports.parseBuiltin=(content,layoutType,post)=>parseBuiltin(content,layoutType,post);