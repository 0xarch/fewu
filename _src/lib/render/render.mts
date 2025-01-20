import { extname } from "path";
import { Result, Wrapper } from "#lib/types";
import { readFile } from "fs/promises";
import Console from "#util/Console";
import EventEmitter from "events";
import pugProcessor from "./mod/pug.mjs";
import fewuRendererMarkdown from "fewu-renderer-markdown";

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
    availableProcessors: Processor[] = [
        pugProcessor,
        fewuRendererMarkdown
    ]

    constructor() {
        super();
    }

    isTypeSupported(type: string): Result<Processor | null> {
        for (let render of this.availableProcessors) {
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
        let ext = extname(templatePath), matchedRenderer: Processor | undefined;
        for (let renderer of this.availableProcessors) {
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

        resultWrapper.value = await matchedRenderer.render(content, templatePath, variables);

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

export default Renderer;