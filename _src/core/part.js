import { join } from 'path';
import { cp } from 'fs';
import db from '#db';
import { info } from '#core/run';
import { proc_final } from '#core/builder';

async function theme_operations() {
    let operations = db.theme.config.get('operations');
    operations.forEach(async (v) => {
        switch (v.do) {
            case "copy":
                {
                    if (v.from.charAt(0) == '@') {
                        switch (v.from) {
                            case "@posts":
                                cp('posts', join(db.dirs.public, v.to), {}, () => { });
                                break;
                            case "@icon":
                                cp('_assets', join(db.dirs.public, v.to), {}, () => { });
                                break;
                        }
                    } else {
                        cp(join(db.theme.dirs.extra, v.from), join(db.dirs.public, v.to), { recursive: true }, () => { });
                    }
                }
                break;
        }
    });

    info(['OPERATION.THEME', 'MAGENTA', 'BOLD'], ['COMPLETE', 'GREEN']);
}

async function copy_files() {
    let publicDir = db.dirs.public;
    cp(db.theme.dirs.files, join(publicDir, 'files'), { recursive: true }, () => { });
    cp('resources', join(publicDir, 'resources'), { recursive: true }, () => { });

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
            info(['SUCCESS', "GREEN"], [item.title, 'MAGENTA'], [destname, 'YELLOW']);
    });
}

export {
    copy_files,
    theme_operations,
    build_post_pages
}