import { join } from 'path';
import { writeFile } from 'fs';

let root_url = database.config?.site_url;

function txt(){
    let result = root_url + '\n';
    for (const v of database.site.posts) { result += encodeURI(root_url + v.path.website) + '\n' }
    return result;
}

function xml() {
    let result = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
    result += `<url><loc>${encodeURI(root_url)}</loc><priority>1.0</priority></url>`;
    for (const v of database.site.posts) {
        result += `<url><loc>${encodeURI(root_url + v.path.website)}</loc><lastmod>${v.lastModifiedDate.getFullYear()}-${v.lastModifiedDate.getMonth() + 1}-${v.lastModifiedDate.getDate()}</lastmod></url>`;
    }
    result += '</urlset>';
    return result;
}

function generateSitemap() {
    if (!root_url) return;

    const conf = database.config.modules?.sitemap ?? {};
    let path = join(PUBLIC_DIRECTORY, conf.name), type = conf.type;
    if (type == 'txt') {
        writeFile(path, txt(), () => { });
    } else {
        writeFile(path, xml(), () => { })
    }
}

const Module = {
    exec: generateSitemap
}

export default Module;