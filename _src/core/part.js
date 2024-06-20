import { join } from 'path';
import { cp,readFileSync } from 'fs';
import db from '#db';
import { info } from '#core/run';
import { procFinal } from '#core/builder';
import { BuildTemplate, Collection, Layout } from '#struct';
import { write } from '#core/builder';

async function resolveThemeOperations() {
    let operations = db.theme.config.operations;
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

    info(['COMPLETE', 'GREEN'], ['OPERATION.THEME', 'MAGENTA', 'BOLD']);
}

async function copyFiles() {
    let publicDir = db.dirs.public;
    cp(db.theme.dirs.files, join(publicDir, 'files'), { recursive: true }, () => { });
    cp('resources', join(publicDir, 'resources'), { recursive: true }, () => { });

    info(['COMPLETE', 'GREEN'], ['OPERATION.COPY', 'MAGENTA', 'BOLD']);
}

async function buildPosts() {
    let filename = join(db.theme.dirs.layout, db.theme.config.template);
    let build_template = new BuildTemplate(
            db.builder.parser_name,
            readFileSync(filename).toString(),
            {
                basedir: db.theme.dirs.layout,
                filename
            }
        );
    db.site.posts.forEach(async item => {
        let destname = join(db.dirs.public, item.path.local);
        const STAT = procFinal(build_template,{
            ...db.builder.api_required,
            filename,
            post: item
        },destname);
        if (STAT == 'Ok') info(['SUCCESS', "GREEN"], [item.title, 'MAGENTA'], [destname, 'YELLOW']);
    });
}

async function buildPages(){
    for (let item of db.theme.config.layouts) {
        write(new Collection({ ...db.builder.api_required }), new Layout(item));
    }
}

export {
    copyFiles,
    resolveThemeOperations,
    buildPosts,
    buildPages
}