import { readFile } from "fs/promises";
import { Renderer } from "../render.mjs";
import { Marked } from "marked";

const marked = new Marked();

export default class RendererMarkdown extends Renderer {
    static async render(template: string, templatePath?: string, variables?: object): Promise<string> {
        return marked.parse(template) as string;
    }

    static async renderFile(templatePath: string, variables?: object): Promise<string> {
        let buffer = await readFile(templatePath);
        let content = buffer.toString();
        return RendererMarkdown.render(content,templatePath,variables);
    }
};