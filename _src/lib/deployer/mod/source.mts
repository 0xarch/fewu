import { Context } from "#lib/types";
import { cp } from "fs/promises";
import { basename, extname, join, relative } from "path";
import { Deployable } from "../deployer.mjs";
import ExtendedFS from "#util/ExtendedFS";
import processors from "./source/common.mjs";
import { existsSync } from "fs";
import Console from "#util/Console";

export declare interface Processor {
    type: RegExp,
    processor: (ctx: Context, path: string) => Promise<void>;
};

class SourceDeployer implements Deployable {
    availableProcessors: Processor[] = [
        ...processors
    ];
    fallbackProcessor: Processor = {
        type: /\..*$/,
        processor: async (ctx, path) => {
            let target = join(ctx.PUBLIC_DIRECTORY,path), origin = join(ctx.THEME_DIRECTORY,'source',path);
            await ExtendedFS.ensure(target);
            await cp(origin,target);
        }
    };
    private async deploy_single(ctx: Context, file: string) {
        if (basename(file).startsWith('_')) {
            return;
        }
        let _extname = extname(file);
        let processor: Processor["processor"] = this.fallbackProcessor.processor;
        for(let _processor of this.availableProcessors){
            if(_processor.type.test(_extname)){
                processor = _processor.processor;
            }
        }
        await processor(ctx,file);
    }
    async deploy(ctx: Context) {
        let sourceDir = join(ctx.THEME_DIRECTORY, 'source');
        try {
            await ExtendedFS.ensure(ctx.PUBLIC_DIRECTORY);
            for (let file of await ExtendedFS.traverse(sourceDir)) {
                file = relative(sourceDir,file);
                await this.deploy_single(ctx,file);
            }
        } catch (e) {
            console.error(e);
        }
    }
    async deployWatch(ctx: Context, path: string): Promise<any> {
        try {
            let _fullpath = join(ctx.THEME_DIRECTORY,path);
            if(!existsSync(_fullpath)){
                return;
            }
            if(path.startsWith('source')){
                let _path = relative('source',path);

                Console.log(`Reprocessing source file: ${path}`);

                await this.deploy_single(ctx, _path);
            }
        } catch (e) {
            console.error(e);
        }
    }
}

const sourceDeployer = new SourceDeployer();

export default sourceDeployer;