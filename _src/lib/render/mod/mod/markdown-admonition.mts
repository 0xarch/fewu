/**
 * Marked Admonition Extension
 * 
 * This is a fork of xiefucai's marked-admonition-extension project, as the origin project lacks maintenance.
 * 
 * Origin project: https://github.com/xiefucai/marked-admonition-extension
 */

import { MarkedExtension, Tokens, TokenizerExtension, TokenizerThis, RendererExtension, RendererThis } from 'marked';

type Config = {
    nodeName: string;
    className: string;
    title: { nodeName: string; }
}
const admonitionTypes = [
    "abstract",
    "attention",
    "bug",
    "caution",
    "danger",
    "error",
    "example",
    "failure",
    "hint",
    "info",
    "note",
    "question",
    "quote",
    "success",
    "tip",
    "warning"
];
const startReg =
    new RegExp(`^(?:!!!)|(?:\:\:\:)\\s+(${admonitionTypes.join('|')})(?:\\s+)?(.*)$`);
const endReg = /^(?:!!!)|(?:\:\:\:)\s*$/;
let config: Config = { nodeName: 'div', className: 'admonition', title: { nodeName: 'p' } };

const admonitionPlugin: TokenizerExtension | RendererExtension = {
    name: 'admonition',
    level: 'block',
    start(this: TokenizerThis, src: string) {
        const index = src.match(new RegExp(`(^|[\\r\\n])(?:!!!)|(?:\:\:\:)\\s+(${admonitionTypes.join('|')})(?:\\s+)?(.*)`))?.index;
        return index;
    },
    tokenizer(src: string, _tokens): Tokens.Generic | void {
        const lines = src.split(/\n/);
        if (startReg.test(lines[0])) {
            const section = { x: -1, y: -1 };
            const sections = [];
            for (let i = 0, k = lines.length; i < k; i++) {
                if (startReg.test(lines[i])) {
                    section.x = i;
                } else if (endReg.test(lines[i])) {
                    section.y = i;
                    if (section.x >= 0) {
                        sections.push({ ...section });
                        section.x = -1;
                        section.y = -1;
                    }
                }
            }

            if (sections.length) {
                const section = sections[0];
                const [_, icon, title] = startReg.exec(lines[section.x]) || [];
                const text = lines.slice(section.x + 1, section.y).join('\n');
                const raw = lines.slice(section.x, section.y + 1).join('\n');
                const token = {
                    type: 'admonition',
                    raw,
                    icon,
                    title,
                    text,
                    titleTokens: [],
                    tokens: [],
                    childTokens: ['title', 'text'],
                };

                this.lexer.inlineTokens(token.title, token.titleTokens);
                this.lexer.blockTokens(token.text, token.tokens);
                return token;
            }
        }
    },
    renderer(this: RendererThis, token) {
        const html = `<${config.nodeName} class="${config.className} ${config.className}-${token.icon}">
    <${config.title.nodeName} class="${config.className}-title">${this.parser.parseInline(
            token.titleTokens, null as any
        )}</${config.title.nodeName}>
    ${this.parser.parse(token.tokens!)}
    </${config.nodeName}>`;
        return html;
    },
};

const extensions: (TokenizerExtension | RendererExtension)[] = [admonitionPlugin];

const setConfig = (data: Config) => {
    config = data;
}

export { admonitionTypes, setConfig };

const admonition: () => MarkedExtension = () => ({ extensions });

export default admonition;