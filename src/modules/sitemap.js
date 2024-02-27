function generateSitemapTxt(root_url, posts) {
    let result = root_url + '\n';
    for (let v of posts) {
        result += encodeURI(root_url + v.path('website')) + '\n';
    }
    return result;
}

function generateSitemapXml(root_url, posts) {
    let result = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
    result += `<url><loc>${encodeURI(root_url)}</loc><priority>1.0</priority></url>`;
    for (let v of posts) {
        result += `<url><loc>${encodeURI(root_url + v.path('website'))}</loc><lastmod>${v.datz.toString()}</lastmod></url>`;
    }
    result += '</urlset>';
    return result;
}

const SITEMAP = {
    TXT(root_url, posts) {
        let result = root_url + '\n';
        for (let v of posts) { result += encodeURI(root_url + v.path('website')) + '\n' }
        return result;
    },
    XML(root_url, posts) {
        let result = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
        result += `<url><loc>${encodeURI(root_url)}</loc><priority>1.0</priority></url>`;
        for (let v of posts) {
            result += `<url><loc>${encodeURI(root_url + v.path('website'))}</loc><lastmod>${v.lastModifiedDate.getFullYear()}-${v.lastModifiedDate.getMonth()+1}-${v.lastModifiedDate.getDate()}</lastmod></url>`;
        }
        result += '</urlset>';
        return result;
    }
}

export {
    generateSitemapTxt,
    generateSitemapXml
}

export default SITEMAP;