import { Context, PageContainer, Page, Post } from "#lib/types";
import { Source, Theme } from "#lib/local/local";

function post_sort(a: Page, b: Page): number {
    return a?.date?.isBefore(b.date) ? 1 : a?.date?.isSame(b.date) ? 0 : -1;
}

function store(post: Post, keys: string[], targets: PageContainer[]) {
    for (let key of keys) {
        let found = false;
        for (let target of targets) {
            if (key === target.key) {
                target.values.push(post);
                found = true;
                break;
            }
        }
        if (!found) {
            targets.push({
                key,
                values: [post]
            });
        }
    }
    targets.forEach(v => {
        v.values.sort(post_sort);
    })
}

export default async function collectData(ctx: Context) {
    let posts = await Source.traverse(ctx, 'post', ctx.config.excluded_files);
    await Promise.all(posts.map(path => (async () => {
        let post = await Source.read(ctx, 'post', path);
        store(post, post.categories, ctx.data.categories);
        store(post, post.tags, ctx.data.tags);
        ctx.data.posts.push(post);
    })()));
    ctx.data.posts.sort(post_sort);
    ctx.data.posts.forEach((v, i, a) => {
        v.current = i;
        v.total = a.length;
        v.prev = a[i - 1];
        v.next = a[i + 1];
    });
    ctx.data.categories.sort((a, b) => a.key > b.key ? 1 : -1);
    ctx.data.tags.sort((a, b) => a.key > b.key ? 1 : -1);
    await Theme.executePlugins(ctx);
}