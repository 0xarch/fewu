import { Context } from "#lib/types";
import { cp } from "fs/promises";
import { join } from "path";
import { Deployable } from "../deployer.mjs";

class SourceDeployer implements Deployable {
    static async deploy(ctx: Context) {
        await cp(join(ctx.THEME_DIRECTORY,'source'),ctx.PUBLIC_DIRECTORY,{
            recursive: true
        });
    }
}

export default SourceDeployer;