function generateSitemapTxt(root_url,posts,theme_config){
    let result = root_url+'\n';
    for(let v of posts){
        result += root_url+v.websitePath+'\n';
    }
    return result;
}

export {
    generateSitemapTxt
}