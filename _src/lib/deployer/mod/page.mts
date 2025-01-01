import { Context, Pagable, Page, Result } from "#lib/types";
import { basename, extname, join, relative } from "path";
import { Deployable } from "../deployer.mjs";
import { readdir, writeFile } from "fs/promises";
import { renderFile } from "#lib/render/render";
import { getHelpers } from "#lib/interface/helper";
import ExtendedFS from "#util/ExtendedFS";
import Console from "#util/Console";
import defaultPages from "./page/defaultPage.mjs";

class PageDeployer implements Deployable {
    private static async deploy_single(ctx: Context, pagable: Pagable, path: string): Promise<Result<void>> {
        let targets = pagable.get(ctx);
        let tasks: Promise<Result<void>>[] = [];
        for (let i = 0; i < targets.length; i++) {
            const target = targets[i];
            const page: Page = {
                language: ctx.config.language,
                current: i,
                total: targets.length,
                path: relative(ctx.PUBLIC_DIRECTORY, target),
                source: path,
                full_source: path
            };
            let task = (async (): Promise<Result<void>> => {
                const result = await renderFile(path, {
                    site: ctx.data,
                    page,
                    ctx,
                    ...getHelpers(ctx, page as Page)
                });
                await ExtendedFS.ensure(target);
                await writeFile(target, result);
                Console.may.info('Deploy success:', target);
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
        let validPages = [...defaultPages, ...ctx.plugin.append_pages];
        for (const file of files) {
            let filename = basename(file, extname(file));
            if (!await ExtendedFS.isDir(file)) {
                for (let pagable of validPages) {
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