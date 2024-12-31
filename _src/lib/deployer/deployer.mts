import { Context } from "#lib/types";
import PageDeployer from "./mod/page.mjs";
import PostDeployer from "./mod/post.mjs";
import SourceDeployer from "./mod/source.mjs";

export abstract declare class Deployable {
    static deploy(ctx: Context): Promise<any>;

    [key: string]: any;
}

const deployers: Deployable[] = [
    PostDeployer,
    PageDeployer,
    SourceDeployer
];

export default class Deployer {
    static async run(ctx: Context){
        await Promise.all(deployers.map(v => v.deploy(ctx)));
    }
}