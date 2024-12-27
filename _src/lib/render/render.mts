import { extname } from "path";
import RendererMarkdown from "./mod/markdown.mjs";
import RendererPug from "./mod/pug.mjs";

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
        matcher: /^pug$/,
        renderer: new RendererPug
    },
    {
        matcher: /^(md)|(markdown)$/,
        renderer: new RendererMarkdown
    }
];

export async function render(content: string, templatePath: string, variables?: object): Promise<string> {
    let ext = extname(templatePath), matchedRenderer: Renderer | undefined;
    for(let renderer of availableRenderers){
        if(renderer.matcher.test(ext)){
            matchedRenderer = renderer.renderer;
        }
    }
    if(!matchedRenderer){
        throw new Error(`Some content requires a renderer that has not been supported: ${templatePath} requires ${ext}.`);
    }

    let result = matchedRenderer.render(content, templatePath, variables);

    return result;
}