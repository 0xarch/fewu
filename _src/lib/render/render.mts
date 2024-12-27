import RendererMarkdown from "./mod/markdown.mjs";
import RendererPug from "./mod/pug.mjs";

export declare class Renderer {
    static render(template: string, templatePath?: string, variables?: object): Promise<string>;

    static renderFile(templatePath: string, variables?: object): Promise<string>;
}

export const Renderers = {
    pug: RendererPug,
    markdown: RendererMarkdown
}