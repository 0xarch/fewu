import { Context } from "#lib/types";
import Server from "#lib/server/server";
import Argv from "#util/Argv";
import Console from "#util/Console";
import { join } from "node:path";

let watchTasks: Record<string,{ctx: Context, path: string, from: string }> = {};
let timer: NodeJS.Timeout;

function registerWatchTask(ctx: Context, path: string, from: string) {
    watchTasks[join(from,path)] = {
        ctx, path, from
    };
    timer && clearInterval(timer);
    // debounce
    timer = setInterval(()=>{
        for(let [_, {ctx, path, from}] of Object.entries(watchTasks)){
            ctx.Deployer.runWatch(ctx, path, from);
        }
        watchTasks = {};
    },500);
}

export default function registerServer(ctx: Context) {
    if (Argv['-s'] || Argv['--server']) {
        const server = new Server();
        if (Argv['-S'] || Argv['--server']) {
            ctx.on('afterDeploy', (_ctx) => {
                server.create(_ctx).listen(parseInt(Argv['-S']?.[0] || Argv['--server']?.[0]) || 3000);
                try {
                    _ctx.locals.Theme.watch(_ctx, (_ctx, _, path, from) => {
                        // _ctx.Deployer.runWatch(_ctx, path, from);
                        registerWatchTask(_ctx, path, from);
                    });
                    _ctx.locals.Source.watch(_ctx, (_ctx, _, path, from) => {
                        // _ctx.Deployer.runWatch(_ctx, path, from);
                        registerWatchTask(_ctx, path, from);
                    });
                } catch (error) {
                    console.error(error);
                    Console.error(`Your current system does not support Node.js fs.watch (recursively) feature. Live-change will not work.`);
                }
            });
        }
    }
}