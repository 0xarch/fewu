import { parse } from "yaml";
import { availableParser, Parser } from "../object-parser.mjs";

class _YamlParser implements Parser {
    async parse(content: string){
        return parse(content);
    }
    parseSync(content: string) {
        return parse(content);
    }
}

const YamlParser: availableParser = {
    type: /\.?ya?ml$/,
    parser: new _YamlParser()
}

export default YamlParser;