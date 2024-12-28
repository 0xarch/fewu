import Context from "#lib/fewu/context";
import { Post, Scaffold } from "#lib/types";
import { resolveContent } from "#lib/local/mod/post"

import ExtendedFS from "#util/ts/ExtendedFS";
import Text from "#util/ts/Text";

import { readFile, stat } from "fs/promises";
import { extname, join } from "path";;
import moment from "moment";

const ignoredFileTypes = [
    '.png', '.gif', '.webp', '.bmp', /^\.pptx?$/, /^\.jpe?g?$/, /^\..*?ignore$/
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
        const path = join(ctx.SOURCE_DIRECTORY, type + 's');
        let files = await ExtendedFS.traverse(path, {
            includeDirectory: false
        });
        files = files.filter(value => !excluded.includes(value) && !isIgnoredFileType(extname(value)));
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
        post.categories = String(resolved.properties.categories).split(" ");
        post.comments = resolved.postIntroduction;
        post.content = resolved.postContent;
        post.date = moment(resolved.properties.date);
        post.language = resolved.properties.language as string ?? ctx.config.language;
        post.layout = resolved.properties.layout ?? ctx.config.deafult_layout;
        post.length = Text.wordCount(content);
        post.license = resolved.properties.license as string ?? 'default';
        post.properties = resolved.properties;
        post.source = path;
        post.stat = fileStat;
        post.tags = String(resolved.properties.tags).split(" ");
        post.title = resolved.properties.title ?? "Untitled";
        post.updated = moment(fileStat.ctime);
        return post as Post;
    }
}