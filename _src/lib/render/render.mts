import { extname } from "path";
import RendererMarkdown from "./mod/markdown.mjs";
import RendererPug from "./mod/pug.mjs";
import { Result } from "#lib/types";
import { readFile } from "fs/promises";
import Console from "#util/Console";

export declare interface Renderer {
    render(template: string, templatePath?: string, variables?: object): Promise<string>;

    renderFile(templatePath: string, variables?: object): Promise<string>;
}

export const Renderers = {
    pug: RendererPug,
    markdown: RendererMarkdown
};

declare interface availableRenderer {
    matcher: RegExp,
    renderer: Renderer
};

export const availableRenderers: availableRenderer[] = [
    {
        matcher: /^\.pug$/,
        renderer: new RendererPug
    },
    {
        matcher: /^\.(md)|(markdown)$/,
        renderer: new RendererMarkdown
    }
];

export function isTypeSupported(type: string): Result<Renderer | null> {
    for(let render of availableRenderers){
        if(render.matcher.test(type)){
            return {
                status: 'Ok',
                value: render.renderer
            }
        }
    }
    return {
        status: 'Err',
        value: null
    }
}

export async function render(content: string, templatePath: string, variables?: object): Promise<string> {
    let ext = extname(templatePath), matchedRenderer: availableRenderer | undefined;
    for(let renderer of availableRenderers){
        if(renderer.matcher.test(ext)){
            matchedRenderer = renderer;
        }
    }
    if(!matchedRenderer){
        throw new Error(`Some content requires a renderer that has not been supported: ${templatePath} requires ${ext}.`);
    } else {
        Console.info(`Render ${templatePath} using matcher: ${matchedRenderer.matcher}`);
    }

    let result = matchedRenderer.renderer.render(content, templatePath, variables);

    return result;
}

export async function renderFile(templatePath: string, variables?: object): Promise<string> {
    let buffer = await readFile(templatePath);
    let content = buffer.toString();
    return render(content,templatePath,variables);
}