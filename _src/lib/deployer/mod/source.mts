import { Context } from "#lib/types";
import { cp } from "fs/promises";
import { basename, dirname, join, relative } from "path";
import { Deployable } from "../deployer.mjs";
import ExtendedFS from "#util/ExtendedFS";

class SourceDeployer implements Deployable {
    static async deploy(ctx: Context) {
        let sourceDir = join(ctx.THEME_DIRECTORY, 'source');
        try {
            await ExtendedFS.ensure(ctx.PUBLIC_DIRECTORY);
            for (const file of await ExtendedFS.traverse(sourceDir)) {
                if (basename(file).startsWith('_')) {
                    continue;
                }
                await ExtendedFS.ensure(dirname(file));
                cp(file, join(ctx.PUBLIC_DIRECTORY, relative(sourceDir, file)));
            }
        } catch (e) {
            console.error(e);
        }
    }
}

export default SourceDeployer;