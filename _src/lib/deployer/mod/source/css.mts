import { Context } from "#lib/types";
import { join } from "path";
import { Processor } from "../source.mjs";
import { compile } from "sass";
import ExtendedFS from "#util/ExtendedFS";
import { writeFile } from "fs/promises";

class CssProcessor implements Processor {
    type= /\.s?css$/;
    async processor(ctx: Context, path: string){
        let origin = join(ctx.THEME_DIRECTORY,'source',path), target = join(ctx.PUBLIC_DIRECTORY,path).replace(/\.sc?ss$/,'.css');
        let result = compile(origin, {
            style: 'compressed'
        });
        await ExtendedFS.ensure(target);
        await writeFile(target,result.css);
    }
}

const cssProcessor = new CssProcessor();

export default cssProcessor;