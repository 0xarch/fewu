import { Context } from "#lib/types";
import PageDeployer from "./mod/page.mjs";
import PostDeployer from "./mod/post.mjs";
import sourceDeployer from "./mod/source.mjs";

export abstract declare class Deployable {
    static deploy(ctx: Context): Promise<any>;
    static deployWatch(ctx: Context, path:string): Promise<any>;

    [key: string]: any;
}

const deployers: Deployable[] = [
    PostDeployer,
    PageDeployer,
    sourceDeployer
];

export default class Deployer {
    static async run(ctx: Context){
        await Promise.all(deployers.map(v => v.deploy(ctx)));
    }

    static async runWatch(ctx: Context, path: string){
        await Promise.all(deployers.map(v => v.deployWatch(ctx,path)));
    }
}