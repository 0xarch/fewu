import { Config, AppPlugin, I18nUsable } from "../types.mjs";
import { version } from "./fewu.mjs";
import defaultConfig, { mixConfig, readConfig } from "./config.mjs";

import Argv from "#util/Argv";
import Console from "#util/Console";
import NewPromise from "#util/NewPromise";

import { join } from "path";
import { EventEmitter } from "events";
import { existsSync } from "fs";
import DataStorage from "#lib/data/data";
import Renderer from "#lib/render/render";
import ObjectParser from "#lib/object-parser/object-parser";
import Deployer from "#lib/deployer/deployer";
import Server from "#lib/server/server";
import { Theme } from "#lib/local/local";
import { ConfigNotFoundError } from "#lib/interface/error";

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
    public plugin: AppPlugin;
    public i18ns: I18nUsable[];

    public readonly BASE_DIRECTORY: string;
    public readonly PUBLIC_DIRECTORY: string;
    public readonly SOURCE_DIRECTORY: string;
    public readonly THEME_DIRECTORY: string;
    public readonly CONFIG_PATH: string;

    public readonly Deployer;
    public readonly Renderer;
    public readonly ObjectParser;
    public readonly Server;

    constructor(baseDirectory = process.cwd()) {
        // construct EventEmitter
        super();

        let configPaths = [...[Argv['-C']?.[0]].filter(Boolean), 'config.yaml', 'config.yml', '_config.yaml', '_config.yml', 'config.json'].map(v => join(baseDirectory, v));
        let CONFIG_PATH: string | undefined;
        for(let configPath of configPaths){
            if(existsSync(configPath)){
                CONFIG_PATH = configPath;
            }
        }
        if(!CONFIG_PATH){
            throw new ConfigNotFoundError(configPaths);
        }
        Console.log(`Using config: ${CONFIG_PATH}`);

        // const configuration
        const CONFIG = mixConfig(defaultConfig, readConfig(baseDirectory, CONFIG_PATH));

        this.VERSION = version;
        this.config = { ...CONFIG };
        this.env = process.env;
        this.data = new DataStorage();
        this.plugin = {
            append_pages: [],
            helpers: {}
        };
        this.i18ns = [];

        this.BASE_DIRECTORY = baseDirectory;
        this.PUBLIC_DIRECTORY = join(baseDirectory, CONFIG.public_dir);
        this.SOURCE_DIRECTORY = join(baseDirectory, CONFIG.source_dir);
        this.THEME_DIRECTORY = join(baseDirectory, 'themes', CONFIG.theme);
        this.CONFIG_PATH = CONFIG_PATH;

        if (Argv['-S'] || Argv['--server']) {
            if (process.platform !== 'win32') {
                this.PUBLIC_DIRECTORY = `/tmp/io.fewu.server`;
            }
        }

        this.Deployer = new Deployer(this);
        this.Renderer = Renderer;
        this.ObjectParser = ObjectParser;
        this.Server = new Server();
    }

    async callServer() {
        let { promise, resolve } = NewPromise.withResolvers();
        if (Argv['-S'] || Argv['--server']) {
            this.Server.create(this).listen(parseInt(Argv['-S']?.[0] || Argv['--server']?.[0]) || 3000);
            Theme.watch(this, (ctx, type, path) => {
                ctx.Deployer.runWatch(ctx, path);
            });
        }
        return promise;
    }
}

export default Context;