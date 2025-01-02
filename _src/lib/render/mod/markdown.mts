import { readFile } from "fs/promises";
import { Renderer } from "../render.mjs";
import { Marked } from "marked";
import { mangle } from "marked-mangle";
import { gfmHeadingId } from "marked-gfm-heading-id";
import admonition from "./mod/markdown-admonition.mjs";

const marked = new Marked();

marked.use(mangle(), gfmHeadingId(), admonition());

export default class RendererMarkdown implements Renderer {
    async render(template: string, templatePath?: string, variables?: object): Promise<string> {
        return marked.parse(template) as string;
    }

    async renderFile(templatePath: string, variables?: object): Promise<string> {
        let buffer = await readFile(templatePath);
        let content = buffer.toString();
        return this.render(content, templatePath, variables);
    }
};