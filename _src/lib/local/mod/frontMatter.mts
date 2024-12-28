import { parse } from "yaml";

function configString(content: string, end: string): [string, number] {
    let lines = content.split('\n'), i = 0;
    let stackedConfigLines: string[] = [];
    for (let line of lines) {
        if (line.trim() === end) {
            break;
        } else {
            stackedConfigLines.push(line);
        }
    }
    let rawConfig = stackedConfigLines.join('\n');
    return [rawConfig, i];
}

export function resolve(content: string): [Record<string, string>, number] {
    let obj = {}, i = 0;
    if (content.startsWith('---')) {
        let [config, _i] = configString(content.replace('---\n', ''), '---');
        obj = parse(config);
        i = _i;
    } else if (content.startsWith('"')) {
        let [config, _i] = configString(content, ';;;');
        obj = JSON.parse('{' + config) + '}';
        i = _i;
    }

    return [obj, i];
}