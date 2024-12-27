import { Source } from "#lib/local/local";
import { Context, Post, Result } from "#lib/types";
import ExtendedFS from "#util/ts/ExtendedFS";
import { writeFile } from "fs/promises";
import { join, relative } from "path";

export default class PostDeployer {
    static async deploy(ctx: Context, post: Post): Promise<Result<void>> {
        let target = join(ctx.PUBLIC_DIRECTORY, relative(ctx.SOURCE_DIRECTORY, post.source));

        await ExtendedFS.ensure(target);
        await writeFile(target,post.content);

        return {
            status: 'Ok'
        };
    }

    static async deployAll(ctx: Context, files: string[]): Promise<Result<Result<void>[]>> {
        let results: Result<void>[] = [], hasErr = false;
        for await(let path of files){
            let post = await Source.read(ctx,"post",path);
            let result = await PostDeployer.deploy(ctx,post);
            if(result.status === 'Err') {
                hasErr = true;
            }
            results.push(result);
        }
        return {
            status: hasErr ? 'Err' : 'Ok',
            information: results
        }
    }
}