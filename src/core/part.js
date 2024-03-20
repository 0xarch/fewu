import db from './database.js';
import {join} from 'path';
import {cp} from 'fs';
import {run,info} from '../lib/mod.js';
import {proc_final} from './builder.js';

async function copy_files() {
    let ThemeConfig = db.theme.get_all();
    let publicDir = db.dirs.public;
    let themeFileDir = db.dirs.theme.files;
    cp(themeFileDir, join(publicDir, 'files'), { recursive: true }, () => { });
    cp('resources', join(publicDir, 'resources'), { recursive: true }, () => { });
    if (ThemeConfig.copy) {
        for (let key in ThemeConfig.copy) {
            if (key.charAt(0) == '@') {
                switch (key) {
                    case "@posts":
                        run(() => {
                            cp('posts', join(publicDir, ThemeConfig.copy['@posts']), { recursive: true }, () => { });
                        }, 9101);
                        break;
                }
            } else {
                run(() => {
                    cp(join(themeFileDir, 'extra', key), join(publicDir, ThemeConfig.copy[key]), { recursive: true }, () => { });
                }, 9102);
            }
        }
    }
    if (ThemeConfig.enableThemeWebsiteIcon) {
        cp(join(themeFileDir, 'extra/favicon.ico'), publicDir, () => { });
    } else {
        cp('./nexo_sources/favicon.ico', join(publicDir, 'favicon.ico'), (e) => { if (e) throw e });
    }
    info(['OPERATION.COPY', 'MAGENTA', 'BOLD'], ['COMPLETE', 'GREEN']);
}

async function build_post_pages(options, GivenVariables) {
    const layoutType = db.builder.type;
    const template = db.builder.template.post;
    db.site.posts.forEach(async item => {
        let destname = join(db.dirs.public, item.path('local'));
        proc_final(layoutType, template, options, {
            post: item,
            ...GivenVariables
        }, destname) == 'Ok' &&
        info([item.title, 'MAGENTA'], [destname, 'YELLOW'], ['SUCCESS', "GREEN"]);
    });
}

export {
    copy_files,
    build_post_pages
}