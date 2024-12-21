import { Config } from "./types.mjs";
import { version } from "./fewu.mjs";
import defaultConfig from "./defaultConfig.mjs";

import { join } from "path";
import { EventEmitter } from "events";

interface Context {
    on(event: 'startup', listenter: (...args: any[]) => any): this;
    on(event: 'beforeDeploy', listenter: (...args: any[]) => any): this;
    on(event: 'beforeProcess', listenter: (...args: any[]) => any): this;
    on(event: 'afterProcess', listenter: (...args: any[]) => any): this;
    on(event: 'beforeGenerate', listenter: (...args: any[]) => any): this;
    on(event: 'afterGenerate', listenter: (...args: any[]) => any): this;
    on(event: 'afterDeploy', listenter: (...args: any[]) => any): this;
    on(event: 'ready', listenter: (...args: any[]) => any): this;
    on(event: 'exit', listenter: (...args: any[]) => any): this;
}

class Context extends EventEmitter {

    public readonly VERSION: string;
    public readonly config: Config;
    public readonly env: typeof process.env;

    public readonly BASE_DIRECTORY: string;
    public readonly PUBLIC_DIRECTORY: string;
    public readonly SOURCE_DIRECTORY: string;
    public readonly THEME_DIRECTORY: string;

    constructor(baseDirectory = process.cwd()) {
        super();
        this.VERSION = version;
        this.config = { ...defaultConfig };
        this.env = process.env;

        this.BASE_DIRECTORY = baseDirectory;
        this.PUBLIC_DIRECTORY = join(baseDirectory, 'public');
        this.SOURCE_DIRECTORY = join(baseDirectory, 'source');
        this.THEME_DIRECTORY = join(baseDirectory, 'themes', this.config.theme);
    }
}

export default Context;