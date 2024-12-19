import { join } from 'path';
import { writeFile } from 'fs';

let root_url = globalThis.database.data.directory.buildRootDirectory;

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
    ).join('')}
</channel>
</rss>`;
}

function exec() {
    const config = globalThis.database.data.module.options.rss ?? {};
    let text = getRSSFeedXml(config.title,root_url,config.description,globalThis.database.data.builder.site.posts);
    writeFile(join(PUBLIC_DIRECTORY,'feed.xml'),text,(e)=>{if(e)throw e});
}

const Module = {
    exec
}

export default Module;
