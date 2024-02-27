import Article from './classes.js';

/**
 * 
 * @param {string} blog_title 
 * @param {string} blog_link 
 * @param {string} description 
 * @param {[Article]} articles 
 */
function getRSSFeedXml(blog_title,blog_link,description,articles){
  return `<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
<channel>
<title>${blog_title}</title>
<atom:link href="${blog_link}" rel="self" type="application/rss+xml" />
<link>${blog_link}</link>
<description>${description}</description>
${articles.map(v=>
`<item>
<title>${v.title}</title>
<link>${blog_link+v.path('website')}</link>
<guid isPermaLink="false">ID${v.id}</guid>
<description>${v.foreword}</description>
<pubDate>${v.date}</pubDate>
</item>`
)}
</channel>
</rss>`;
}

export {
  getRSSFeedXml
}