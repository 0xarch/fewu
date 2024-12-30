import { Config } from "../types.mjs";
import { version } from "./fewu.mjs";
import defaultConfig, { mixConfig } from "./config.mjs";

import Argv from "#util/Argv";

import { join } from "path";
import { EventEmitter } from "events";
import { existsSync } from "fs";
import { readConfig } from "#lib/local/config";
import DataStorage from "#lib/data/data";

interface Context {
    on(event: 'startup', listenter: (ctx: Context, ...args: any[]) => any): this;
    on(event: 'afterStartup', listenter: (ctx: Context, ...args: any[]) => any): this;
    on(event: 'beforeProcess', listenter: (ctx: Context, ...args: any[]) => any): this;
    on(event: 'afterProcess', listenter: (ctx: Context, ...args: any[]) => any): this;
    on(event: 'beforeGenerate', listenter: (ctx: Context, ...args: any[]) => any): this;
    on(event: 'afterGenerate', listenter: (ctx: Context, ...args: any[]) => any): this;
    on(event: 'beforeDeploy', listenter: (ctx: Context, ...args: any[]) => any): this;
    on(event: 'afterDeploy', listenter: (ctx: Context, ...args: any[]) => any): this;
    on(event: 'ready', listenter: (ctx: Context, ...args: any[]) => any): this;
    on(event: 'exit', listenter: (ctx: Context, ...args: any[]) => any): this;
}

class Context extends EventEmitter {

    public readonly VERSION: string;
    public readonly config: Config;
    public readonly env: typeof process.env;
    public readonly data: DataStorage;

    public readonly BASE_DIRECTORY: string;
    public readonly PUBLIC_DIRECTORY: string;
    public readonly SOURCE_DIRECTORY: string;
    public readonly THEME_DIRECTORY: string;
    public readonly CONFIG_PATH: string;

    constructor(baseDirectory = process.cwd()) {
        // construct EventEmitter
        super();

        let CONFIG_PATH = join(baseDirectory, Argv['-C']?.[0] ?? 'config.yaml');

        // temporaily compatibility patch
        if(!existsSync(CONFIG_PATH)){
            CONFIG_PATH = join(baseDirectory, Argv['-C']?.[0] ?? 'config.json');
        }

        // const configuration
        const CONFIG = mixConfig(defaultConfig, readConfig(baseDirectory, CONFIG_PATH));

        this.VERSION = version;
        this.config = { ...CONFIG };
        this.env = process.env;
        this.data = new DataStorage();

        this.BASE_DIRECTORY = baseDirectory;
        this.PUBLIC_DIRECTORY = join(baseDirectory, CONFIG.public_dir);
        this.SOURCE_DIRECTORY = join(baseDirectory, CONFIG.source_dir);
        this.THEME_DIRECTORY = join(baseDirectory, 'themes', CONFIG.theme);
        this.CONFIG_PATH = CONFIG_PATH;
    }
}

export default Context;