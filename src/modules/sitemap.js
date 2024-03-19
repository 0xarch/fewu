import db from '../core/database.js';
import {join} from 'path';
import {writeFile} from 'fs';

const sitemap = {
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

function generateSitemap(){
    if (db.settings.has('sitemap')) {
        if(db.settings.get('sitemap.enabled')==false) return;
        let path = join(db.dirs.public, db.settings.get('sitemap.name')), type = db.settings.get('sitemap.type');
        let url = db.settings.get('site_url');
        if (type == 'txt') {
            writeFile(path, sitemap.TXT(url, db.site.posts), () => { })
        } else {
            writeFile(path, sitemap.XML(url, db.site.posts), () => { })
        }
    }
}

export default generateSitemap;