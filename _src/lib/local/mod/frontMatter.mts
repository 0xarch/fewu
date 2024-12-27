import { parse } from "yaml";

function configString(content: string, end: string): string {
    let lines = content.split('\n');
    let stackedConfigLines: string[] = [];
    for (let line of lines) {
        if (line.trim() === end) {
            break;
        } else {
            stackedConfigLines.push(line);
        }
    }
    let rawConfig = stackedConfigLines.join('\n');
    return rawConfig;
}

export function resolve(content: string): Record<string, string> {
    let obj = {};
    if (content.startsWith('---')) {
        let config = configString(content.replace('---\n', ''), '---');
        obj = parse(config);
    } else if (content.startsWith('"')) {
        let config = '{' + configString(content, ';;;') + '}';
        obj = JSON.parse(config);
    }

    return obj;
}