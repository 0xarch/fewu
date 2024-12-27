import Context from "#lib/fewu/context";
import { Post } from "#lib/types";
import ExtendedFS from "#util/ts/ExtendedFS";
import { join } from "path";

export default class Source {
    private source_dir: string;

    constructor(ctx: Context) {
        this.source_dir = ctx.SOURCE_DIRECTORY;
    }

    async traverse(type: 'draft' | 'post', excluded: string[]): Promise<string[]> {
        const path = join(this.source_dir, type + 's');
        let files = await ExtendedFS.traverse(path, {
            includeDirectory: false
        });
        files = files.filter(value => excluded.includes(value));
        return files;
    }
}