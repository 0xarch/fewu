import Config from "./conf.ts";

function parseBuiltin(content: string, layoutType: string, postTitle) {
  let TitlePrefix = "", TitleSeperator = "", TitleSuffix = "", Features = "";
  switch (layoutType) {
    case "archive": {
      TitlePrefix = "归档";
      break;
    }
    case "category": {
      TitlePrefix = "分类";
      break;
    }
    case "post": {
      TitlePrefix = postTitle;
      break;
    }
    case "about": {
      TitlePrefix = "关于";
      break;
    }
  }
  if (layoutType != "index") {
    TitleSeperator = ` ${Config.lookAndFeel.customSeperator} `;
  }
  if (
    Config.lookAndFeel.customSiteTitle != undefined ||
    Config.lookAndFeel.customSiteTitle != "none"
  ) {
    TitleSuffix = Config.lookAndFeel.customSiteTitle;
  } else {
    TitleSuffix = `${Config.name}'s Blog`;
  }
  if (Config.features.enableCodeHighlight) {
    Features +=
      "<link rel='stylesheet' href='//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css'>" +
      "<script src='//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js'></script>" +
      "<script>hljs.highlightAll()</script>";
  }
  if (Config.features.enablePostToc && (layoutType== "post" || layoutType == "about")){
    Features += 
    `<script>
      window.onload=()=>{
        let toc_div=document.querySelector("#toc_div");
        document.querySelectorAll("div.postContent h1").forEach(item=>{
        let a=document.createElement('a');
        a.href=\`#\${item.id}\`;
        a.innerHTML=item.innerHTML;
        a.className="linker";
        toc_div.appendChild(a);toc_div.appendChild(document.createElement("br"))});
      }
    </script>`;
  }
  content = content
    .replace(
      /&builtin::title/g,
      `<title>${TitlePrefix}${TitleSeperator}${TitleSuffix}</title>`,
    )
    .replace(/&builtin::siteTitle/g, TitleSuffix)
    .replace(/&builtin::features/g, Features);
  return content;
}

export { parseBuiltin };
