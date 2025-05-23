import { ConfigNotParsableError } from "#lib/interface/error";
import ObjectParser from "#lib/object-parser/object-parser";

const defaultConfig = {
    title: 'Fewu',
    description: '',
    author: 'Meteor',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    url: 'https://blog.example.org',
    root: '/',
    deafult_layout: 'default',
    source_dir: 'source',
    public_dir: 'public',
    theme: 'Blank',
    excluded_files: [] as string[]
}

export default defaultConfig;

export declare type defaultConfigType = typeof defaultConfig & {
    [key: string]: any,
};

export declare type partialConfigType = Partial<defaultConfigType>;

export function mixConfig(defaultConfig: defaultConfigType, userConfig: partialConfigType): defaultConfigType {
    const mixedConfig: partialConfigType = {};
    Object.assign(mixedConfig, defaultConfig);
    Object.assign(mixedConfig, userConfig);

    return mixedConfig as defaultConfigType;
};

export function readConfig(_baseDir = process.cwd(), configPath: string): partialConfigType {
    let obj: partialConfigType | null = {};

    obj = ObjectParser.parseFileSync(configPath);

    if (!obj) {
        throw new ConfigNotParsableError(configPath);
    }

    return obj;
}