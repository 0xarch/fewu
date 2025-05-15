import { Context, Result } from "#lib/types";
import Console from "#util/Console";
import PageDeployer from "./mod/page.mjs";
import PostDeployer from "./mod/post.mjs";
import SourceDeployer from "./mod/source.mjs";

export abstract declare class Deployable {
    static deploy(ctx: Context): Promise<Result<string>>;
    static deployWatch(ctx: Context, path: string, from: string): Promise<any>;

    [key: string]: any;
}

class Deployer {
    deployers: Deployable[] = [];

    constructor(ctx: Context) {
        this.deployers = [
            new PostDeployer(ctx),
            new PageDeployer(ctx),
            new SourceDeployer(ctx)
        ]
    }

    async run(ctx: Context) {
        Console.log(`Delivering deploy tasks...`);
        let taskStatus = await Promise.allSettled(this.deployers.map(v => v.deploy(ctx)));
        taskStatus.forEach(v => {
            if (v.status === "rejected") {
                throw new Error(`Error! ${v}`);
            }
        })
        Console.log(`All deploy tasks are completed.`);
    }

    async runWatch(ctx: Context, path: string, from: string) {
        await Promise.allSettled(this.deployers.map(v => v.deployWatch(ctx, path, from)));
    }
}

export default Deployer;

export {
    Deployer as DeployerConstructor
}