import database from '#database';
import { readFile, cp, mkdir } from 'fs/promises';

import { dirname, join } from 'path';
import { procFinal } from '#core/builder';
import { BuildTemplate, Collection, Layout } from '#struct';
import { write } from '#core/builder';
import { existsSync } from 'fs';
import Console from '#util-ts/Console';

await globalThis.DATABASE_INIT_DONE;
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
                                cp('posts', join(publicDirectory, v.to), { recursive: true });
                                break;
                            case "@icon":
                                cp('_assets', join(publicDirectory, v.to), { recursive: true });
                                break;
                        }
                    } else {
                        cp(join(extraDirectory, v.from), join(publicDirectory, v.to), { recursive: true });
                    }
                }
                break;
        }
    });

    Console.info(`[Workflow/Operation] Theme operations are completed.`);
}

async function copyFiles() {
    cp(fileDirectory, join(publicDirectory, 'files'), { recursive: true }, () => { });
    cp('resources', join(publicDirectory, 'resources'), { recursive: true }, () => { });

    Console.info(`[Workflow/Operation] Copy operations are completed.`);
}

async function buildPosts() {
    let filename = join(layoutDirectory, database.data.theme.config.template);
    let template = (await readFile(filename)).toString();
    let build_template = new BuildTemplate(
        database.data.theme.config.parser,
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
            ...database.data.builder.exposedApi,
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
        write(new Collection({ ...database.data.builder.exposedApi }), new Layout(item));
    }
}

export {
    copyFiles,
    resolveThemeOperations,
    buildPosts,
    buildPages
}