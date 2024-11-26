import database from '#database';
import { readFile, cp } from 'fs/promises';

import { join } from 'path';
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
                                cp('posts', join(db.dirs.public, v.to), { recursive: true });
                                break;
                            case "@icon":
                                cp('_assets', join(db.dirs.public, v.to), { recursive: true });
                                break;
                        }
                    } else {
                        cp(join(db.theme.dirs.extra, v.from), join(db.dirs.public, v.to), { recursive: true });
                    }
                }
                break;
        }
    });

    info(['COMPLETE', 'GREEN'], ['OPERATION.THEME', 'MAGENTA', 'BOLD']);
}

async function copyFiles() {
    let publicDir = database.data.directory.publicDirectory;
    cp(db.theme.dirs.files, join(publicDir, 'files'), { recursive: true }, () => { });
    cp('resources', join(publicDir, 'resources'), { recursive: true }, () => { });

    info(['COMPLETE', 'GREEN'], ['OPERATION.COPY', 'MAGENTA', 'BOLD']);
}

async function buildPosts() {
    let filename = join(db.theme.dirs.layout, db.theme.config.template);
    let template = (await readFile(filename)).toString();
    let build_template = new BuildTemplate(
            db.builder.parser_name,
            template,
            {
                basedir: db.theme.dirs.layout,
                filename
            }
        );
    db.site.posts.forEach(item => {
        let destname = join(database.data.directory.publicDirectory, item.path.local);
        procFinal(build_template,{
            ...db.builder.api_required,
            filename,
            post: item
        },destname);
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