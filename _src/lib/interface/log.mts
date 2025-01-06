import { url, version } from "#lib/fewu/fewu";
import { Context } from "#lib/types";
import Console from "#util/Console";

export function assignBasicLog(_ctx: Context) {
    _ctx.on('startup', () => {
        Console.log({
            color: 'LIGHTGREEN',
            effect: 'BOLD',
            msg: 'Starting up...'
        });
    });

    _ctx.on('afterStartup', () => {
        Console.log({
            color: 'LIGHTGREEN',
            effect: 'BOLD',
            msg: 'Initialization complete.'
        });
        Console.log({
            color: 'MAGENTA',
            effect: 'BOLD',
            msg: `Fewu, version ${version}, ${url}`
        });
    });

    _ctx.on('afterDeploy', () => {
        Console.log({
            color: 'LIGHTGREEN',
            effect: 'BOLD',
            msg: 'Deploy finished.'
        })
    });

    _ctx.on('ready', (ctx) => {
        Console.log({
            color: 'LIGHTGREEN',
            effect: 'BOLD',
            msg: `Site is ready in ${ctx.PUBLIC_DIRECTORY}/.`
        });
    });

    _ctx.on('exit', () => {
        Console.log({
            color: 'LIGHTGREEN',
            effect: 'BOLD',
            msg: 'Exiting...'
        })
    });
}