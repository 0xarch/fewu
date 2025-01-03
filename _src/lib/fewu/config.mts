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
    theme: 'Neo',
    excluded_files: [] as string[],
    features: [] as string[],
    modules: [] as string[]
}

export default defaultConfig;

export declare type defaultConfigType = typeof defaultConfig;

export declare type partialConfigType = Partial<defaultConfigType>;

export function mixConfig(defaultConfig: defaultConfigType, userConfig: partialConfigType): defaultConfigType {
    const mixedConfig: partialConfigType = {};
    Object.assign(mixedConfig, defaultConfig);
    Object.assign(mixedConfig, userConfig);

    if(typeof mixedConfig.theme !== 'string'){
        mixedConfig.theme = 'Neo';
    }

    return mixedConfig as defaultConfigType;
};