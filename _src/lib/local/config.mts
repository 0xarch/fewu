import { partialConfigType } from "#lib/fewu/config";

import { existsSync, readFileSync } from "fs";
import { extname } from "path";
import { parse } from "yaml";

export function readConfig(baseDir = process.cwd(), configPath: string): partialConfigType {
    let obj: partialConfigType = {};

    let path = configPath;
    let ext = extname(path);

    if (!existsSync(path)) {
        throw new Error('The configuration file does not exist: ' + path);
    }

    let content = readFileSync(path).toString();

    switch (ext) {
        case 'json': {
            obj = JSON.parse(content);
        }
        case 'yaml': {
            obj = parse(content);
        }
    }

    return obj;
}