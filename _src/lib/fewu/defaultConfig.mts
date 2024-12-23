const defaultConfig = {
    title: 'Fewu',
    description: '',
    author: 'Meteor',
    language: 'zh-CN',
    timezone: 'Asia/Shanghai',
    url: 'https://blog.example.org',
    root: '/',
    source_dir: 'source',
    public_dir: 'public',
    theme: 'Neo',
    features: [] as string[],
    modules: [] as string[]
}

export default defaultConfig;

export declare type defaultConfigType = typeof defaultConfig;