export declare class Renderer {
    static render(template: string, templatePath: string, variables: object): string;

    static renderFile(templatePath: string, variables: object): string;
}