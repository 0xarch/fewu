import { Context } from "#lib/types";
import PostDeployer from "./mod/post.mjs";
import SourceDeployer from "./mod/source.mjs";

declare interface _Deployer {
    deploy(ctx: Context): Promise<any>;

    [key: string]: any;
}

const deployers: _Deployer[] = [
    PostDeployer,
    SourceDeployer
];

export default class Deployer {
    static async run(ctx: Context){
        await Promise.all(deployers.map(v => v.deploy(ctx)));
    }
}