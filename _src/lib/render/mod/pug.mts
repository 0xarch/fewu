import { dirname } from "path";
import { Renderer } from "../render.mjs";

import { compile, compileFile } from "pug";

class RendererPug extends Renderer {
    static async render(template: string, templatePath: string, variables: object): Promise<string> {
        let compiled = compile(template, {
            filename: templatePath,
            basedir: dirname(templatePath)
        });
        return compiled(variables);
    }

    static async renderFile(templatePath: string, variables: object): Promise<string> {
        return compileFile(templatePath, {
            filename: templatePath,
            basedir: dirname(templatePath)
        })(variables);
    }
}

export default RendererPug;