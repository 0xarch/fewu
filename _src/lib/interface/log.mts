import { url, version } from "#lib/fewu/fewu";
import { Context } from "#lib/types";
import Console from "#util/Console";

export function assignBasicLog(_ctx: Context) {
    _ctx.on('startup', () => {
        Console.log({
            color: 'GREEN',
            msg: 'Starting up...'
        });
    });

    _ctx.on('afterStartup', () => {
        Console.log({
            color: 'GREEN',
            msg: 'Initialization complete.'
        });
        Console.log({
            color: 'MAGENTA',
            msg: `Fewu, version ${version}, ${url}`
        });
    });

    _ctx.on('ready', (ctx) => {
        Console.log({
            color: 'GREEN',
            msg: `Site is ready in ${ctx.PUBLIC_DIRECTORY}/.`
        });
    });

    _ctx.on('exit', () => {
        Console.log({
            color: 'GREEN',
            msg: 'Exiting...'
        })
    });
}