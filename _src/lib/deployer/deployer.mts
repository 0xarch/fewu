import { Context } from "#lib/types";
import PostDeployer from "./mod/post.mjs";

export default class Deployer {
    static async run(ctx: Context){
        await PostDeployer.deployAll(ctx);
    }
}