import { Config } from "./types.mjs";
import { version } from "./fewu.mjs";
import defaultConfig from "./defaultConfig.mjs";

import { join } from "path";

class Context {
    public readonly VERSION: string;
    public readonly config: Config;
    public readonly env: typeof process.env;

    public readonly BASE_DIRECTORY: string;
    public readonly PUBLIC_DIRECTORY: string;
    public readonly SOURCE_DIRECTORY: string;
    public readonly THEME_DIRECTORY: string;

    constructor(baseDirectory = process.cwd()){
        this.VERSION = version;
        this.config = { ... defaultConfig };
        this.env = process.env;

        this.BASE_DIRECTORY = baseDirectory;
        this.PUBLIC_DIRECTORY = join(baseDirectory,'public');
        this.SOURCE_DIRECTORY = join (baseDirectory,'source');
        this.THEME_DIRECTORY = join(baseDirectory,'themes', this.config.theme);
    }
}

export default Context;