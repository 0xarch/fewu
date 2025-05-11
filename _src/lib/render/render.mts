import { extname, join } from "path";
import { Result, Wrapper } from "#lib/types";
import { readFile } from "fs/promises";
import Console from "#util/Console";
import EventEmitter from "events";
import pugProcessor from "./mod/pug.mjs";
import { AbstractRenderer } from '@fewu-swg/abstract-types';
import NodeModules from "#util/NodeModules";

export declare interface Processor {
    type: RegExp;

    render(template: string, templatePath?: string, variables?: object): Promise<string>;

    renderFile(templatePath: string, variables?: object): Promise<string>;
}

interface _Renderer {
    on(event: 'beforeRender', fn: (wrapper: Wrapper<string>, ...args: any[]) => void): this;
    on(event: 'afterRender', fn: (wrapper: Wrapper<string>, ...args: any[]) => void): this;
}

class _Renderer extends EventEmitter {
    // this feature should be deprecated as we use availableRenderers
    availableProcessors: Processor[] = [
        pugProcessor
    ]

    availableRenderers: AbstractRenderer[] = [
        pugProcessor // built-in
    ];

    constructor() {
        super();
    }

    async init(){
        let all_modules = await NodeModules.getAllModules();
        let renderer_modules_list = all_modules.filter(v => v.replace(/^@.*[\/\\]/,'').startsWith('fewu-renderer'));
        let renderers = (await Promise.all(renderer_modules_list.map(async v => (await import(join(process.cwd(),"node_modules",v))).renderer as AbstractRenderer))); // idk why node does not allow import("@**/*"), or host-path is required?
        renderers = renderers.filter(v=>v).filter(v => v.__fewu__ === 'renderer');
        this.availableRenderers.push(...renderers);

        Console.info({
            msg: 'Available renderers:',
            color: 'GREEN'
        }, this.availableRenderers as unknown as string); // this is a little trick. Will be removed when URS is complete. **NOTE**
    }

    isTypeSupported(type: string): Result<AbstractRenderer | null> {
        for (let render of this.availableRenderers) {
            if (render.type.test(type)) {
                return {
                    status: 'Ok',
                    value: render
                }
            }
        }
        return {
            status: 'Err',
            value: null
        }
    }

    async render(content: string, templatePath: string, variables?: object): Promise<string> {
        let ext = extname(templatePath), matchedRenderer: AbstractRenderer | undefined;
        for (let renderer of this.availableRenderers) {
            if (renderer.type.test(ext)) {
                matchedRenderer = renderer;
            }
        }
        if (!matchedRenderer) {
            Console.may.error(`Some content requires a renderer that has not been supported: ${templatePath} requires ${ext}.`);
            return content;
        } else {
            Console.may.info({ msg: `Render ${templatePath} using matcher: ${matchedRenderer.type}`, color: 'DARKGREY' });
        }

        let resultWrapper: Wrapper<string> = {
            value: content
        };

        this.emit('beforeRender', resultWrapper);

        resultWrapper.value = await matchedRenderer.render(content, templatePath, variables ?? {});

        this.emit('afterRender', resultWrapper);

        return resultWrapper.value;
    }

    async renderFile(templatePath: string, variables?: object): Promise<string> {
        let buffer = await readFile(templatePath);
        let content = buffer.toString();
        return this.render(content, templatePath, variables);
    }
}

const Renderer = new _Renderer();

await Renderer.init();

export default Renderer;