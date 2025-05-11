import Context from "#lib/fewu/context";
import { Post, Scaffold } from "#lib/types";
import { resolveContent } from "#lib/local/mod/post"

import ExtendedFS from "#util/ExtendedFS";
import Text from "#util/Text";

import { readFile, stat } from "fs/promises";
import { extname, join, relative } from "path";;
import moment from "moment";
import Renderer from "#lib/render/render";

const ignoredFileTypes = [
    '.png', '.gif', '.webp', '.bmp', '.svg', /^\.pptx?$/, /^\.jpe?g?$/, /^\..*?ignore$/, /\.ignore\..*$/
];

function isIgnoredFileType(type: string) {
    for (let tester of ignoredFileTypes) {
        if (typeof tester === 'string') {
            if (type === tester)
                return true;
        }
        else if (tester.test(type)) {
            return true;
        }
    }
}

declare type SourceTypes = 'draft' | 'post' | 'scaffold';

export default class Source {

    static async traverse(ctx: Context, type: SourceTypes, excluded: string[]): Promise<string[]> {
        console.log(`Reading ${type} with blacklist: [${excluded.join(',')}]`);
        const path = join(ctx.SOURCE_DIRECTORY, type + 's');
        let files = await ExtendedFS.traverse(path, {
            includeDirectory: false
        });
        files = files.filter(value => {
            let absoluteIncluded = excluded.includes(value);
            let relativeIncluded = excluded.includes(relative(ctx.SOURCE_DIRECTORY, value));
            let isIgnored = isIgnoredFileType(extname(value));
            return !absoluteIncluded && !relativeIncluded && !isIgnored;
        });
        return files;
    }

    static async read(ctx: Context, type: 'post' | 'draft', path: string): Promise<Post>;
    static async read(ctx: Context, type: 'scaffold', path: string): Promise<Scaffold>;

    static async read(ctx: Context, type: SourceTypes, path: string) {
        let content = (await readFile(path)).toString();
        if (type === 'post' || type === 'draft') {
            return this.read_post(ctx, path, content);
        } else if (type === 'scaffold') {
            return {
                content
            };
        }
    }

    private static async read_post(ctx: Context, path: string, content: string): Promise<Post> {
        let fileStat = await stat(path);
        let resolved = resolveContent(content);
        let post: Partial<Post> = {};
        post.author = resolved.properties.author as string ?? ctx.config.author;
        post.categories = String(resolved.properties.categories ?? resolved.properties.category).split(" ").filter(v => v !== '');
        post.comments = resolved.properties.comments ? true : false;
        post.content = await Renderer.render(resolved.postContent, path, { ctx });
        post.date = moment(resolved.properties.date);
        post.excerpt = resolved.postIntroduction;
        post.full_source = path;
        post.language = resolved.properties.language as string ?? ctx.config.language;
        post.layout = resolved.properties.layout ?? ctx.config.deafult_layout;
        post.length = Text.wordCount(content);
        post.license = resolved.properties.license as string ?? 'default';
        post.more = resolved.postContent;
        post.properties = resolved.properties;
        post.raw = resolved.postContent;
        post.source = relative(ctx.SOURCE_DIRECTORY, path);
        post.stat = fileStat;
        post.tags = String(resolved.properties.tags ?? resolved.properties.tag).split(" ").filter(v => v !== '');
        post.title = resolved.properties.title ?? "Untitled";
        post.relative_path = post.source;
        post.updated = moment(fileStat.ctime);
        post.path = join(ctx.PUBLIC_DIRECTORY, post.source);
        return post as Post;
    }
}