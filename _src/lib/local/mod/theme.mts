import { Context } from "#lib/types";
import ExtendedFS from "#util/ExtendedFS";
import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { join } from "path";

export default class Theme {
    static async executePlugins(ctx: Context): Promise<void> {
        let pluginDir = join(ctx.THEME_DIRECTORY, 'scripts');
        if (!existsSync(pluginDir)) {
            return;
        }
        let scriptPaths = (await readdir(pluginDir)).filter(ExtendedFS.isDir).map(v => join(pluginDir, v));
        for (let scriptPath of scriptPaths) {
            let script = (await import(scriptPath)).default;
            if (typeof script === 'function') {
                script(ctx);
            }
        }
        return;
    }
}