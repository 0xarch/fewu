import database from '#database';
import { readFile, cp, mkdir } from 'fs/promises';

import { dirname, join } from 'path';
import db from '#db';
import { info } from '#core/run';
import { procFinal } from '#core/builder';
import { BuildTemplate, Collection, Layout } from '#struct';
import { write } from '#core/builder';
import { existsSync } from 'fs';
import Console from '#util/Console';

const { publicDirectory } = database.data.directory;
const { extraDirectory, fileDirectory,layoutDirectory } = database.data.directory.theme;

async function resolveThemeOperations() {
    let operations = database.data.theme.config.operations;
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
                        cp(join(extraDirectory, v.from), join(db.dirs.public, v.to), { recursive: true });
                    }
                }
                break;
        }
    });

    info(['COMPLETE', 'GREEN'], ['OPERATION.THEME', 'MAGENTA', 'BOLD']);
}

async function copyFiles() {
    cp(fileDirectory, join(publicDirectory, 'files'), { recursive: true }, () => { });
    cp('resources', join(publicDirectory, 'resources'), { recursive: true }, () => { });

    info(['COMPLETE', 'GREEN'], ['OPERATION.COPY', 'MAGENTA', 'BOLD']);
}

async function buildPosts() {
    let filename = join(layoutDirectory, database.data.theme.config.template);
    let template = (await readFile(filename)).toString();
    let build_template = new BuildTemplate(
        db.builder.parser_name,
        template,
        {
            basedir: layoutDirectory,
            filename
        }
    );
    /**
     * @param {import("#class/post").default} item
     */
    const process = (item)=>{
        let destname = join(database.data.directory.publicDirectory, item.path.local);
        procFinal(build_template,{
            ...db.builder.api_required,
            filename,
            post: item
        },destname).then(()=>{
            if(database.data.feature.enabled.includes('generator/copy-next-image')){
                item.referencedImages.forEach(async imageUrl => {
                    let itemDirectory = dirname(item.filePath);
                    let originPath = join(itemDirectory,imageUrl);
                    let targetPath = join(publicDirectory,dirname(item.path.local),imageUrl);
                    if(existsSync(originPath)){
                        mkdir(dirname(targetPath),{recursive: true}).then((str)=>{
                            cp(originPath,targetPath,{recursive: true}).then(()=>{
                                Console.log(`[Part] Copied ${originPath} to ${targetPath}`)
                            });
                        })
                    }
                });
            }
        });
    }
    database.data.builder.site.posts.forEach(process);
}

async function buildPages(){
    for (let item of database.data.theme.config.layouts) {
        write(new Collection({ ...db.builder.api_required }), new Layout(item));
    }
}

export {
    copyFiles,
    resolveThemeOperations,
    buildPosts,
    buildPages
}