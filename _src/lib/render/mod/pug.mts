import { dirname } from "path";
import { Processor } from "../render.mjs";

import { compile, compileFile } from "pug";

class PugProcessor implements Processor {
    type= /\.pug$/;

    async render(template: string, templatePath: string, variables: object): Promise<string> {
        let compiled = compile(template, {
            filename: templatePath,
            basedir: dirname(templatePath)
        });
        return compiled(variables);
    }

    async renderFile(templatePath: string, variables: object): Promise<string> {
        return compileFile(templatePath, {
            filename: templatePath,
            basedir: dirname(templatePath)
        })(variables);
    }
}

const pugProcessor = new PugProcessor;

export default pugProcessor;