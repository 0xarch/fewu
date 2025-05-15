import { Context } from "#lib/types";
import Server from "#lib/server/server";
import Argv from "#util/Argv";

export default function registerServer(ctx: Context) {
    if(Argv['-s'] || Argv['--server']) {
        const server = new Server();
        if (Argv['-S'] || Argv['--server']) {
            ctx.on('afterDeploy',(_ctx) => {
                server.create(_ctx).listen(parseInt(Argv['-S']?.[0] || Argv['--server']?.[0]) || 3000);
                _ctx.locals.Theme.watch(_ctx, (_ctx, _, path, from) => {
                    _ctx.Deployer.runWatch(_ctx, path, from);
                });
                _ctx.locals.Source.watch(_ctx,(_ctx, _, path, from) => {
                    _ctx.Deployer.runWatch(_ctx, path, from);
                });
            });
        }
    }
}