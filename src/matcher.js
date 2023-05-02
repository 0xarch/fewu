const CONF = require("./conf.js").CONF;

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
    .replace(/&builtin::title;/g,`<title>${TitlePrefix}${TitleSeperator}${TitleSuffix}</title>`)
    .replace(/&builtin::siteTitle/g,TitleSuffix)
    .replace(/&builtin::features/g,Features);
    return content;
}

exports.parseBuiltin=(content,layoutType,post)=>parseBuiltin(content,layoutType,post);