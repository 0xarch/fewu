import Context from "#lib/fewu/context";
import { Post } from "#lib/types";
import { resolveContent } from "#lib/local/mod/post"

import ExtendedFS from "#util/ts/ExtendedFS";
import Text from "#util/ts/Text";

import { readFile, stat } from "fs/promises";
import { join } from "path";;
import moment from "moment";

declare type SourceTypes = 'draft' | 'post';

export default class Source {

    static async traverse(ctx: Context, type: SourceTypes, excluded: string[]): Promise<string[]> {
        const path = join(ctx.SOURCE_DIRECTORY, type + 's');
        let files = await ExtendedFS.traverse(path, {
            includeDirectory: false
        });
        files = files.filter(value => excluded.includes(value));
        return files;
    }

    static async read(ctx: Context, type: 'post', path: string): Promise<Post>;

    static async read(ctx: Context, type: SourceTypes, path: string) {
        let content = (await readFile(path)).toString();
        if (type === 'post') {
            return this.read_post(ctx, path, content);
        }
    }

    private static async read_draft(ctx: Context, path: string, content: string): Promise<void> {

    }

    private static async read_post(ctx: Context, path: string, content: string): Promise<Post> {
        let fileStat = await stat(path);
        let resolved = resolveContent(content);
        let post: Partial<Post> = {};
        post.author = resolved.properties.author as string ?? ctx.config.author;
        post.categories = String(resolved.properties.categories).split(" ");
        post.comments = resolved.postIntroduction;
        post.content = content;
        post.date = moment(resolved.properties.date);
        post.language = resolved.properties.language as string ?? ctx.config.language;
        post.layout = 'default';
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