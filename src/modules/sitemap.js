function generateSitemapTxt(root_url,posts){
    let result = root_url+'\n';
    for(let v of posts){
        result += encodeURI(root_url+v.websitePath)+'\n';
    }
    return result;
}

function generateSitemapXml(root_url,posts){
    let result = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
    result +=`<url><loc>${encodeURI(root_url)}</loc><priority>0.9</priority></url>`;
    for(let v of posts){
        result+=`<url><loc>${encodeURI(root_url+v.websitePath)}</loc><lastmod>${v.datz.toString()}</lastmod><priority>1.0</priority></url>`;
    }
    result += '</urlset>';
    return result;
}

export {
    generateSitemapTxt,
    generateSitemapXml
}