export class ModuleNotFoundError extends Error {
    constructor(id: string){
        super(`The module ${id} cannot find in node_modules. Be sure you have it installed!`);
    }
}

export class ConfigNotFoundError extends Error {
    constructor(triedFilenames: string[]){
        super(`No configuration file found! Checked ${triedFilenames.join(',')}.`);
    }
}

export class ConfigNotParsableError extends Error {
    constructor(path: string){
        super(`The configuration file ${path} cannot be parsed into object. Please check it!`);
    }
}

export class RenderError extends Error {
    constructor(renderType: string, path: string){
        super(`Error while trying to render ${path} using ${renderType}!`);
    }
}