import { Context } from "#lib/types";
import PostDeployer from "./mod/post.mjs";
import SourceDeployer from "./mod/source.mjs";

export default class Deployer {
    static async run(ctx: Context){
        await PostDeployer.deploy(ctx);
        await SourceDeployer.deploy(ctx);
    }
}