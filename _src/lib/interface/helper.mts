import { Context, Page, PageContainer } from "#lib/types";
import { join } from "path";

declare interface Helpers {
    url_for(path: string): string;
    full_url_for(path: string): string;
    _container_of(type: string, current: number): PageContainer;
}

export function getHelpers(ctx: Context, page: Page): Helpers {
    let category: PageContainer[] = [];
    let tag: PageContainer[] = [];
    ctx.data.categories.map(v => {
        let splitCount = Math.ceil(v.values.length / 10);
        for (let i = 0; i < splitCount; i++) {
            category.push(v);
        }
        return category;
    });
    ctx.data.tags.map(v => {
        let splitCount = Math.ceil(v.values.length / 10);
        for (let i = 0; i < splitCount; i++) {
            tag.push(v);
        }
        return tag;
    });
    return {
        url_for(path) {
            if (path.startsWith('/')) {
                return join(path);
            }
            return join(ctx.config.root, path);
        },
        full_url_for(path) {
            return join(ctx.config.url, path)
        },
        _container_of(type, current) {
            if (type === 'category' || type === 'categories') {
                return category[current];
            } else if (type === 'tag' || type === 'tags') {
                return tag[current];
            } else {
                throw new Error('Invalid type passed to helper: _key_of');
            }
        },
    }
}