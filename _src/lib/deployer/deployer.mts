import { Context } from "#lib/types";
import PostDeployer from "./mod/post.mjs";
import { Source } from "#lib/local/local";

export default class Deployer {
    static async run(ctx: Context){
        let posts = await Source.traverse(ctx,'post',[]);
        await PostDeployer.deployAll(ctx, posts);
    }
}