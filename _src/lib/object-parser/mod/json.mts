import { availableParser, Parser } from "../object-parser.mjs";

class _JsonParser implements Parser {
    async parse(content: string){
        try {
            return JSON.parse(content);
        } catch (e) {
            return null;
        }
    }
}

const JsonParser: availableParser = {
    type: /\.?json$/,
    parser: new _JsonParser()
}

export default JsonParser;