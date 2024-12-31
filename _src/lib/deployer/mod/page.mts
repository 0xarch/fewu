import { Context, Page, Result } from "#lib/types";
import { basename, extname, join } from "path";
import { Deployable } from "../deployer.mjs";
import { readdir, stat, writeFile } from "fs/promises";
import { renderFile } from "#lib/render/render";
import { getHelpers } from "#lib/interface/helper";
import ExtendedFS from "#util/ExtendedFS";
import Console from "#util/Console";

declare interface Pagable {
    type: string;
    get(ctx: Context): string[];
};

async function isDir(path: string): Promise<boolean> {
    let _stat = await stat(path);
    return _stat.isDirectory();
}

const defaultPages: Pagable[] = [
    {
        type: 'index',
        get(ctx: Context) {
            return [
                join(ctx.PUBLIC_DIRECTORY, 'index.html')
            ];
        }
    },
    {
        type: 'archive',
        get(ctx: Context) {
            let count = Math.ceil(ctx.data.posts.length / 10);
            let targets: string[] = [];
            while (count--) {
                targets.push(join(ctx.PUBLIC_DIRECTORY, 'archives', count.toString()));
            }
            targets.reverse();
            return targets;
        }
    }
];

class PageDeployer implements Deployable {
    private static async deploy_single(ctx: Context, pagable: Pagable, path: string): Promise<Result<void>> {
        let targets = pagable.get(ctx);
        let tasks: Promise<Result<void>>[] = [];
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            let task = (async (): Promise<Result<void>> => {
                const result = await renderFile(path, {
                    site: ctx.data,
                    page: {
                        current: i,
                        total: targets.length
                    } as Page,
                    ctx,
                    ...getHelpers(ctx)
                });
                await ExtendedFS.ensure(target);
                await writeFile(target, result);
                Console.info('Deploy success:',target);
                return {
                    status: 'Ok'
                }
            })();
            tasks.push(task);
        }
        await Promise.all(tasks);
        return {
            status: 'Ok'
        };
    }

    static async deploy(ctx: Context): Promise<Result<void>[]> {
        const layoutDir = join(ctx.THEME_DIRECTORY, 'layout');
        let files = (await readdir(layoutDir)).map(v => join(layoutDir, v));

        let tasks: Promise<Result<void>>[] = [];
        for (const file of files) {
            let filename = basename(file, extname(file));
            if (!await isDir(file)) {
                for (let pagable of defaultPages) {
                    if (pagable.type === filename) {
                        let task = PageDeployer.deploy_single(ctx, pagable, file);
                        tasks.push(task);
                        break;
                    }
                }
            }
        }
        return await Promise.all(tasks);
    }
}

export default PageDeployer;