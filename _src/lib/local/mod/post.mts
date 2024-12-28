import { resolve } from "./frontMatter.mjs";

let regExps = {
    MATCH_H1: /\n# /,
    MATCH_IMAGE: /\!\[([^\]]*?)\]\(([^\n]+?)\)/g,
};

export function resolveContent(content: string) {
    let postContent = '';
    let postIntroduction = '';
    let [postProp, i] = resolve(content)
    let properties: Record<string, string> = {
        title: "Untitled",
        date: '1970-1-1',
        category: " ",
        tags: " ",
        license: 'CC BY-NC-SA 4.0',
        ...postProp
    };
    let referencedImages = [];
    const lines = content.split("\n");

    let moreIndex = lines.indexOf('<!--more-->');

    if (moreIndex === -1) {
        /* No introduction provided */
        postContent = lines.slice(i).join('\n');
    } else {
        postContent = lines.slice(moreIndex).join('\n');
    }

    postIntroduction = lines.slice(i, (moreIndex !== -1) ? moreIndex : 5).join('\n').replace(/\#*/g, '');

    referencedImages = [...postContent.matchAll(regExps.MATCH_IMAGE)].map(v => v[2]);

    return {
        properties,
        postContent,
        postIntroduction,
        referencedImages
    };
}