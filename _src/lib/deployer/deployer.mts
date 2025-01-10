import { Context } from "#lib/types";
import PageDeployer from "./mod/page.mjs";
import PostDeployer from "./mod/post.mjs";
import SourceDeployer from "./mod/source.mjs";

export abstract declare class Deployable {
    static deploy(ctx: Context): Promise<any>;
    static deployWatch(ctx: Context, path:string): Promise<any>;

    [key: string]: any;
}

export default class Deployer {
    deployers: Deployable[] = [];

    constructor(ctx: Context) {
        this.deployers = [
            new PostDeployer(ctx),
            new PageDeployer(ctx),
            new SourceDeployer(ctx)
        ]
    }

    async run(ctx: Context){
        await Promise.all(this.deployers.map(v => v.deploy(ctx)));
    }

    async runWatch(ctx: Context, path: string){
        await Promise.all(this.deployers.map(v => v.deployWatch(ctx,path)));
    }
}