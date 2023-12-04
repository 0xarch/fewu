const SelfCloseTags = ['br', 'hr', 'input', 'col', 'URLbase', 'meta', 'link', 'area'];
const JSXSymbols = ['<', '/', '>', '\n', '\t'];

const isCustomTag = (tagName) => {
    return tagName[0].toUpperCase() == tagName[0] && tagName[0] != '!';
};

class Token {
    type;
    symbol;
    constructor(type, symbol) {
        this.type = type;
        this.symbol = symbol;
    }
}

/**
 * 
 * @param { string } text 
 */
function AST(text, removeLineBreak, skipWhitespace) {
    let splits = text.split("");
    let i = 0, len = splits.length;
    let processed = [];
    while (i < len) {
        let char_1 = splits[i];
        if (char_1 == '\\') {
            processed.push(new Token('rawChar', splits[++i]));
        } else
            if (JSXSymbols.includes(char_1)) {
                switch (char_1) {
                    case '<':
                        /** Token : 标签 **/
                        i++;
                        // EJS标签，以防万一
                        if (splits[i] == '%') {
                            let ejs_tag = '<%';
                            i++;
                            while (i < len) {
                                if (splits[i] == '\\') {
                                    i++;
                                    ejs_tag += splits[i];
                                } else if (splits[i] == '%') {
                                    i++;
                                    if (splits[i] == '>') {
                                        i++;
                                        break;
                                    } else ejs_tag += '%';
                                } else ejs_tag += splits[i];
                                i++;
                            }
                            ejs_tag += '%>';
                            processed.push(new Token('variableContent', ejs_tag));
                            continue;
                        }

                        let tagName = '';
                        let hasAttributes = false, attributes = {};
                        // 判断是否是闭合标签
                        if (splits[i] == '/') {
                            i++;
                            while (i < len) {
                                if (splits[i] == '>') {
                                    break;
                                } else if (splits[i] != ' ') {
                                    tagName += splits[i];
                                }
                                i++;
                            }
                            processed.push(new Token('tagEnd', tagName));
                            continue;
                        };

                        // process
                        while (i < len) {
                            /**
                             * <foo    />
                             * 这坨空格叫 "50l" (50% legal)
                             */
                            // 空格可能为 attribute 或 50l
                            if (splits[i] == ' ') {
                                i++;
                                // 如果是 50l 的话那么删掉
                                if (splits[i] == ' ') {
                                    while (i < len) {
                                        if (splits[i] != ' ') break;
                                        i++;
                                    }
                                }
                                // 去掉 50l 之后判断是不是闭合
                                if (splits[i] == '/') {
                                    processed.push(new Token('tagName_selfClosed', tagName));
                                    break;
                                } else if (splits[i] == '>') {
                                    processed.push(new Token('tagName_closedWithContent', tagName));
                                    break;
                                }
                                // 不是闭合则开始解析属性，这个地方可以直接整个解析成 string，但是会有变量的 " 符号问题
                                let attr_key = '', attr_val = '', is_val = false,
                                    single_quote = false, dual_quote = false,
                                    string_started = false, variable_started = false;
                                hasAttributes = true;
                                while (i < len) {
                                    if (splits[i] == '\\') {
                                        i++;
                                        is_val ? (attr_val += splits[i]) : (attr_key += splits[i]);
                                    } else {
                                        if (splits[i] == '"') {
                                            i++;
                                            if (!single_quote) {
                                                dual_quote = !dual_quote;
                                            }
                                            string_started = single_quote || dual_quote;
                                            continue;
                                        }
                                        if (splits[i] == '\'') {
                                            i++;
                                            if (!dual_quote) {
                                                single_quote = !single_quote;
                                            }
                                            string_started = single_quote || dual_quote;
                                            continue;
                                        }
                                        if ((splits[i] == '/' || splits[i] == '>') && !string_started) {
                                            attributes[attr_key] = attr_val;
                                            attr_key = '';
                                            attr_val = '';
                                            break;
                                        }
                                        /*  <div class="class_A" id="id_B" />
                                                ^               ^
                                        */
                                        // 遇到空格判断是属性值还是结束一个声明
                                        if (splits[i] == ' ') {
                                            if (!(string_started || variable_started)) {
                                                is_val = false;
                                                i++;
                                                attributes[attr_key] = attr_val;
                                                attr_key = '';
                                                attr_val = '';
                                                continue;
                                            }
                                        }
                                        /*  <div class="class_A" id="id_B" />
                                                      ^            ^
                                        */
                                        if (splits[i] == '=' && !(string_started || variable_started)) {
                                            is_val = true;
                                            i++;
                                            continue;
                                        }
                                        // 这个地方将字符添加到属性名或属性值
                                        {
                                            is_val ? (attr_val += splits[i]) : (attr_key += splits[i]);
                                        }
                                    }
                                    i++;
                                }
                            }
                            if (splits[i] == '/') {
                                processed.push(new Token('tagName_selfClosed', tagName));
                                if (hasAttributes) processed.push(new Token('tagAttributes', attributes));
                                break;
                            } else
                                if (splits[i] == '>') {
                                    processed.push(new Token('tagName_closedWithContent', tagName));
                                    if (hasAttributes) processed.push(new Token('tagAttributes', attributes));
                                    break;
                                } else
                                    tagName += splits[i];
                            i++;
                        }
                        break;
                    case '/': /** Token : 标签闭合  |  这个代码块在解析合法G-HTML时不会单独执行操作 */ break;
                    case '>': /** Token : 标签结尾  |  这个代码块在解析合法G-HTML时不会单独执行操作 */ break;
                    case '\n':
                    case '\t':
                        if (!removeLineBreak) {
                            processed.push(new Token('rawChar', splits[i]));
                        }
                        if (skipWhitespace) {
                            if (splits[i + 1] == ' ') {
                                i++;
                                while (i < len) {
                                    if (splits[i] != ' ') {
                                        i--;
                                        break;
                                    }
                                    i++;
                                }
                            }
                        }
                        break;
                }
            }
            else processed.push(new Token('rawChar', splits[i]));
        i++;
    }
    return processed;
}

function parseToJS(tokenArray, config, debug = false) {
    let i = 0, len = tokenArray.length;
    let processed = '', element_stack = [];
    if (!config.noPrefixHTML) processed = '<!DOCTYPE html>';
    // 当启用 parseCustomTagToCSSClass 时 元素栈是有用的，这意味着 Token:tagEnd 的 symbol 其实没用
    let class_prefix = config.classPrefix != undefined ? config.classPrefix : '';
    while (i < len) {
        let token_1 = tokenArray[i], str = '', symbol = '';
        switch (token_1.type) {
            case 'tagName_closedWithContent':
                var attrs = {};
                if (tokenArray[i + 1].type == 'tagAttributes') {
                    i++; attrs = tokenArray[i].symbol;
                }
                if (config.elementReplace[token_1.symbol] != undefined)
                    symbol = config.elementReplace[token_1.symbol];
                else if (isCustomTag(token_1.symbol)) {
                    symbol = 'div';
                    attrs['class'] = (attrs['class'] != undefined ? attrs['class'] + ' ' : '') + class_prefix + token_1.symbol;
                } else symbol = token_1.symbol;
                str = '<' + symbol;
                for (let attr in attrs) {
                    str += ' ' + attr + '="' + attrs[attr] + '"';
                }
                str += '>';
                element_stack.push(symbol);
                break;
            case 'tagName_selfClosed':
                var attrs = {};
                if (tokenArray[i + 1].type == 'tagAttributes') {
                    i++; attrs = tokenArray[i].symbol;
                }
                if (config.elementReplace[token_1.symbol] != undefined)
                    symbol = config.elementReplace[token_1.symbol];
                else if (isCustomTag(token_1.symbol)) {
                    symbol = 'div';
                    attrs['class'] = (attrs['class'] != undefined ? attrs['class'] + ' ' : '') + class_prefix + token_1.symbol;
                } else symbol = token_1.symbol;
                str = '<' + symbol;
                for (let attr in attrs) {
                    str += ' ' + attr + '="' + attrs[attr] + '"';
                }
                if (!SelfCloseTags.includes(symbol)) {
                    str += '></' + symbol + '>';
                } else
                    str += '/>';
                break;
            case 'tagEnd':
                let tagName = element_stack.pop();
                str = '</' + tagName + '>';
                break;
            case 'variables':
                let variables = token_1.symbol;
                str += parseToJS(variables, config, debug, false);
                break;
            case 'variableContent':
            case 'rawChar':
                str = token_1.symbol;
                break;
        }
        processed += str;
        i++;
    }
    return processed;
}

exports.AST = AST;
exports.parseToJS = parseToJS;
exports.parse = function (content, config) {
    return parseToJS(AST(content, config.removeLineBreak, config.skipWhitespace), config);
}