import db from "../core/database.js";
import { writeFile } from "fs";
import { join } from "path";

async function generateSearchStrings() {
    if (!db.theme.has('API')) return;
    db.builder.api_required.nexo.searchStringUrl = db.file('searchStrings.json');
    let api_conf = db.theme.get('API');
    if (api_conf.searchComponent) {
        let search_config = api_conf.searchComponent;
        let arr = [];
        let title = search_config.includes('title'),
            id = search_config.includes('id'),
            content = search_config.includes('content'),
            date = search_config.includes('date');
        for (const article of db.site.posts) {
            let href = db.file(article.path('website'));
            let atitle = article.title;
            let acontent = '';
            if (title) acontent += '%%%' + article.title;
            if (id) acontent += '%%%' + article.id;
            if (content) acontent += '%%%' + article.content.replace(/(\n)|([\u0020\n]{2,})/g, ' ').replace(/[#*]/g, '');
            if (date) acontent += '%%%' + article.date.toDateString();
            arr.push({ 'content': acontent, href, atitle });
        }
        writeFile(join(db.dirs.public, 'searchStrings.json'), JSON.stringify(arr), () => { });
    }
}

const Module = {
    exec: generateSearchStrings
}

export default Module;