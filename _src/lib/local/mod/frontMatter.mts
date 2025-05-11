import { EOL } from "os";
import { parse } from "yaml";

function configString(content: string, end: string, i = 0): [string, number] {
    let lines = content.split(EOL);
    let stackedConfigLines: string[] = [];
    for (let line of lines) {
        i++;
        if (line.trim() === end) {
            break;
        } else {
            stackedConfigLines.push(line);
        }
    }
    let rawConfig = stackedConfigLines.join(EOL);
    return [rawConfig, i];
}

export function resolve(content: string): [Record<string, string>, number] {
    let obj = {}, i = 0;
    if (content.startsWith('---')) {
        let [config, _i] = configString(content.replace('---'+EOL, ''), '---',1);
        obj = parse(config);
        i = _i;
    } else if (content.startsWith('"')) {
        let [config, _i] = configString(content, ';;;');
        obj = JSON.parse('{' + config) + '}';
        i = _i;
    }

    return [obj, i];
}