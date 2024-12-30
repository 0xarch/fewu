import { renderFile } from "#lib/render/render";
import { Context, Post, Result } from "#lib/types";
import { getHelpers } from "#lib/interface/helper";
import ExtendedFS from "#util/ts/ExtendedFS";
import { writeFile } from "fs/promises";
import { join, relative } from "path";

export default class PostDeployer {
    private static async deploy_single(ctx: Context, post: Post): Promise<Result<void>> {
        let target = join(ctx.PUBLIC_DIRECTORY, relative(ctx.SOURCE_DIRECTORY, post.source), 'index.html');

        let layoutDir = join(ctx.THEME_DIRECTORY, 'layout');
        let result = await renderFile(join(layoutDir, `post.${post.layout}.pug`), {
            page: post,
            site: ctx.data,
            ctx,
            ...getHelpers(ctx)
        });
        await ExtendedFS.ensure(target);
        await writeFile(target, result);

        return {
            status: 'Ok'
        };
    }

    static async deploy(ctx: Context): Promise<Result<Result<void>[]>> {
        let results: Result<void>[] = [], hasErr = false;
        for await (let post of ctx.data.posts) {
            let result = await PostDeployer.deploy_single(ctx, post);
            if (result.status === 'Err') {
                hasErr = true;
            }
            results.push(result);
        }
        return {
            status: hasErr ? 'Err' : 'Ok',
            value: results
        }
    }
}