function generateSitemapTxt(root_url,posts){
    let result = root_url+'\n';
    for(let v of posts){
        result += root_url+v.websitePath+'\n';
    }
    return result;
}

function generateSitemapXml(){

}

export {
    generateSitemapTxt
}