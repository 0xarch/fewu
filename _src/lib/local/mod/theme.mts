import ObjectParser from "#lib/object-parser/object-parser";
import { Context, I18nUsable, Result } from "#lib/types";
import ExtendedFS from "#util/ExtendedFS";
import { existsSync } from "fs";
import { readdir } from "fs/promises";
import { basename, extname, join } from "path";

export default class Theme {
    static async executePlugins(ctx: Context): Promise<void> {
        let pluginDir = join(ctx.THEME_DIRECTORY, 'scripts');
        if (!existsSync(pluginDir)) {
            return;
        }
        let scriptPaths = (await readdir(pluginDir)).map(v => join(pluginDir, v));
        for (let scriptPath of scriptPaths) {
            if (await ExtendedFS.isDir(scriptPath)) {
                continue;
            }
            let script = (await import(scriptPath)).default;
            if (typeof script === 'function') {
                script(ctx);
            }
        }
        return;
    }

    static async getI18n(ctx: Context): Promise<void> {
        let languageDir = join(ctx.THEME_DIRECTORY, 'languages');
        if (!existsSync(languageDir)) {
            return;
        }
        let i18nPaths = (await readdir(languageDir)).map(v => join(languageDir, v));
        for (let i18nPath of i18nPaths) {
            if (await ExtendedFS.isDir(i18nPath)) {
                continue;
            }
            let id = basename(i18nPath, extname(i18nPath));
            let result = await ObjectParser.parseFile(i18nPath);
            ctx.i18ns.push({
                id: id,
                value: result as Record<string, string>
            });
        }
    }
}