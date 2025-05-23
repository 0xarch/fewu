import { Context, Post, Result } from "#lib/types";
import { getHelpers } from "#lib/interface/helper";
import ExtendedFS from "#util/ExtendedFS";
import { writeFile } from "fs/promises";
import { basename, dirname, extname, join } from "path";
import { Deployable } from "../deployer.mjs";
import { existsSync } from "fs";
import Console from "#util/Console";

export default class PostDeployer implements Deployable {
    constructor(_ctx: Context) {

    }
    async #deploySingle(ctx: Context, post: Post): Promise<Result<void>> {
        let target = join(ctx.PUBLIC_DIRECTORY, post.source, 'index.html');

        let layoutDir = join(ctx.THEME_DIRECTORY, 'layout');
        let result = await ctx.Renderer.renderFile(join(layoutDir, `post.${post.layout}.pug`), {
            page: post,
            site: ctx.data,
            ctx,
            ...getHelpers(ctx, post)
        });
        try {
            await ExtendedFS.ensure(target);
            await writeFile(target, result);

            return {
                status: 'Ok'
            };
        } catch (e) {
            console.error(e);
            return {
                status: 'Err'
            }
        }
    }

    async deploy(ctx: Context): Promise<Result<string>> {
        let tasks: Promise<Result<void>>[] = [];
        for await (let [, post] of Object.entries(ctx.data.sources)) {
            tasks.push(this.#deploySingle(ctx, post));
        }
        let settledResults = await Promise.allSettled(tasks);
        for (let settledResult of settledResults) {
            if (settledResult.status === 'rejected') {
                return {
                    status: 'Err',
                    value: settledResult.reason
                }
            }
        }
        return {
            status: 'Ok',
            value: ''
        }
    }

    async deployWatch(ctx: Context, path: string, from: string): Promise<any> {
        if (from === ctx.SOURCE_DIRECTORY) {
            let recollected = await ctx.locals.Source.read(ctx, "post", join(from,path));
            ctx.data.sources[path] = recollected;
            await ctx.Deployer.run(ctx);
            return;
        } else if (from)
        try {
            let _fullpath = join(ctx.THEME_DIRECTORY, path);
            if (!existsSync(_fullpath)) {
                return;
            }
            if (dirname(path) === 'layout' && basename(path).startsWith('post.')) {
                let filename = basename(path, extname(path));
                let layoutName = extname(filename).replace('.', '');

                Console.log(`Post layout changed: ${filename} -> ${layoutName}`);

                let attachedPosts = ctx.data.posts.filter(v => v.layout === layoutName);

                Console.log(`Rerendering post: ${attachedPosts.map(v => v.title)} by layout changed.`);

                for (let attachedPost of attachedPosts) {
                    await this.#deploySingle(ctx, attachedPost);
                }
            } else {
            }
        } catch (e) {
            console.error(e);
        }
    }
}