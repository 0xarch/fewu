import { Context } from "#lib/types";
import { Source } from "#lib/local/local";

export default async function collectData(ctx: Context) {
    let posts = await Source.traverse(ctx,'post',ctx.config.excluded_files);
    await Promise.all(posts.map(path => (async ()=>{
        let post = await Source.read(ctx,'post',path);
        let categories = post.categories;
        let tags = post.tags;
        ctx.data.posts.push(post);
        ctx.data.categories.push(...categories);
        ctx.data.tags.push(...tags);
    })()));
    ctx.data.categories = [...new Set(ctx.data.categories)];
    ctx.data.tags = [...new Set(ctx.data.tags)];
}