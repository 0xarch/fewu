import { readFile } from "fs/promises";
import { extname } from "path";
import JsonParser from "./mod/json.mjs";
import YamlParser from "./mod/yaml.mjs";
import { readFileSync } from "fs";

export declare interface Parser {
    parse(content: string): Promise<object | null>;
    parseSync(content: string): object | null;
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

    private static _parse(content: string, options: _DirectOptions, isAsync = false): (object | null) | (Promise<object | null>) {
        let _extname = options.type ?? extname(options.path);
        let parser: Parser | undefined;
        for (let availableParser of ObjectParser.availableParsers) {
            if (availableParser.type.test(_extname)) {
                parser = availableParser.parser;
                break;
            }
        }
        if (!parser) {
            return null;
        } else {
            if (isAsync) {
                return parser.parse(content);
            } else {
                return parser.parseSync(content);
            }
        }
    }

    static async parseFile(path: string, options?: _Options): Promise<object | null> {
        let content = (await readFile(path)).toString();
        let result = await this.parse(content, { ...options, path });
        return result;
    }

    static parseFileSync(path: string, options?: _Options): object | null {
        let content = (readFileSync(path)).toString();
        let result = this.parseSync(content, { ...options, path });
        return result;
    }

    static async parse(content: string, options: _DirectOptions): Promise<object | null> {
        return this._parse(content, options, true);
    }

    static parseSync(content: string, options: _DirectOptions): object | null {
        return this._parse(content, options, false);
    }

}
