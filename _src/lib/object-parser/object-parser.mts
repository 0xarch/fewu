import { readFile } from "fs/promises";
import { basename, extname } from "path";
import JsonParser from "./mod/json.mjs";
import YamlParser from "./mod/yaml.mjs";

export declare interface Parser {
    parse(content: string): Promise<object | null>;
}

export declare interface availableParser {
    type: RegExp,
    parser: Parser
}

declare interface _Options {
    type?: string;
    path?: string;
}

declare interface _DirectOptions extends _Options {
    path: string;
}

export default class ObjectParser {
    static availableParsers: availableParser[] = [
        JsonParser,
        YamlParser
    ];

    static async parseFile(path: string, options?: _Options): Promise<object | null> {
        let content = (await readFile(path)).toString();
        let result = await ObjectParser.parse(content, { ...options, path });
        return result;
    }

    static async parse(content: string, options: _DirectOptions): Promise<object | null> {
        let _extname = options.type ?? extname(options.path);
        let parser: Parser | undefined;
        for (let availableParser of ObjectParser.availableParsers) {
            if (availableParser.type.test(_extname)) {
                parser = availableParser.parser;
                break;
            }
        }
        if(!parser){
            return null;
        } else {
            return await parser.parse(content);
        }
    }
}