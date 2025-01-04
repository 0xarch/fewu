import Renderer from "#lib/render/render";
import { Context, Post, Result } from "#lib/types";
import { getHelpers } from "#lib/interface/helper";
import ExtendedFS from "#util/ts/ExtendedFS";
import { writeFile } from "fs/promises";
import { join } from "path";
import { Deployable } from "../deployer.mjs";
import { existsSync } from "fs";
import Console from "#util/Console";

export default class PostDeployer implements Deployable {
    private static async deploy_single(ctx: Context, post: Post): Promise<Result<void>> {
        let target = join(ctx.PUBLIC_DIRECTORY, post.source, 'index.html');

        let layoutDir = join(ctx.THEME_DIRECTORY, 'layout');
        let result = await Renderer.renderFile(join(layoutDir, `post.${post.layout}.pug`), {
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

    static async deployWatch(ctx: Context, path: string): Promise<any> {
        try {
            let _fullpath = join(ctx.THEME_DIRECTORY,path);
            if(!existsSync(_fullpath)){
                return;
            }
            if(path.startsWith('layout/post.')){
                let layoutName = path.replace('layout/post.','').replace(/\..*$/,'');
                let attachedPosts = ctx.data.posts.filter(v => v.layout === layoutName);

                Console.log(`Rerendering post: ${attachedPosts.map(v => v.title)} by layout changed.`);

                for(let attachedPost of attachedPosts){
                    await this.deploy_single(ctx, attachedPost);
                }
            }
        } catch (e) {
            console.error(e);
        }
    }
}