import { readFile } from "fs/promises";
import { Renderer } from "../render.mjs";
import { Marked } from "marked";

const marked = new Marked();

export default class RendererMarkdown implements Renderer {
    async render(template: string, templatePath?: string, variables?: object): Promise<string> {
        return marked.parse(template) as string;
    }

    async renderFile(templatePath: string, variables?: object): Promise<string> {
        let buffer = await readFile(templatePath);
        let content = buffer.toString();
        return this.render(content,templatePath,variables);
    }
};