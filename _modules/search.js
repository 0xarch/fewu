import { get_file_relative_dir } from "#core/reader";
import database from "#database";
import { writeFile } from "fs";
import { join } from "path";

async function generateSearchStrings() {
    const THEME_CONFIG = database.data.theme.config.module?.search;
    console.log('[INFO]  [Module/search] Search is enabled.');
    if (!THEME_CONFIG){
        console.log('[INFO]  [Module/search] Your theme does not support Search.');
        return;
    }
    if (THEME_CONFIG.use) {
    console.log('[INFO]  [Module/search] Generating...');
    let search_config = THEME_CONFIG.use;
    let arr = [];
    let title = search_config.includes('title'),
        id = search_config.includes('id'),
        content = search_config.includes('content'),
        date = search_config.includes('date');
    for (const article of database.data.builder.site.posts) {
        let href = get_file_relative_dir(article.path.website);
        let atitle = article.title;
        let acontent = '';
        if (title) acontent += '%%%' + article.title;
        if (id) acontent += '%%%' + article.id;
        if (content) acontent += '%%%' + article.content.replace(/(\n)|([\u0020\n]{2,})/g, ' ').replace(/[#*]/g, '');
        if (date) acontent += '%%%' + article.date.toDateString();
        arr.push({ 'content': acontent, href, atitle });
    }
    writeFile(join(PUBLIC_DIRECTORY, 'searchStrings.json'), JSON.stringify(arr), () => {
        console.log('[INFO]  [Module/search] Generation complete.');
    });
    }
}

const Module = {
    exec: generateSearchStrings
}

export default Module;
