import db from '#db';
import { join } from 'path';
import { writeFile } from 'fs';

/**
 * 
 * @param {string} blog_title 
 * @param {string} blog_link 
 * @param {string} description 
 * @param {[Post]} articles 
 */
function getRSSFeedXml(blog_title, blog_link, description, articles) {
    return `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>${blog_title}</title>
<atom:link href="${blog_link}" rel="self" type="application/rss+xml" />
<link>${blog_link}</link>
<description>${description}</description>
${articles.map(v =>
        `<item>
<title>${v.title}</title>
<link>${blog_link + v.path.website}</link>
<guid isPermaLink="false">ID${v.id}</guid>
<description>${v.foreword}</description>
<pubDate>${v.lastModifiedDate}</pubDate>
</item>`
    )}
</channel>
</rss>`;
}

function exec() {
    let conf = db.settings.has('modules.rss') ? db.settings.get('modules.rss') : {};
    let text = getRSSFeedXml(conf.title,db.settings.get('site_url'),conf.description,db.site.posts);
    writeFile(join(db.dirs.public,'feed.xml'),text,(e)=>{if(e)throw e});
}

const Module = {
    exec
}

export default Module;