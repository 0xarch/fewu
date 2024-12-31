import { Context, Pagable } from "#lib/types";
import { join } from "path";

const defaultPages: Pagable[] = [
    {
        type: 'index',
        get(ctx: Context) {
            return [
                join(ctx.PUBLIC_DIRECTORY, 'index.html')
            ];
        }
    },
    {
        type: 'archive',
        get(ctx: Context) {
            let count = Math.ceil(ctx.data.posts.length / 10);
            let targets: string[] = [];
            while (count--) {
                targets.push(join(ctx.PUBLIC_DIRECTORY, 'archives', count.toString()));
            }
            targets.reverse();
            return targets;
        }
    },
    {
        type: 'category',
        get(ctx: Context) {
            return [
                join(ctx.PUBLIC_DIRECTORY,'categories')
            ]
        }
    },
    {
        type: 'tag',
        get(ctx: Context) {
            return [
                join(ctx.PUBLIC_DIRECTORY,'tags')
            ]
        }
    }
];

export default defaultPages;