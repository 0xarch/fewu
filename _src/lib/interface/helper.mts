import { Context, Page, PageContainer } from "#lib/types";
import moment from "moment";
import { join } from "path";

declare interface Helpers {
    url_for(path: string): string;
    full_url_for(path: string): string;
    css(param0: string | object | string[] | object[]): string;
    js(param0: string | object | string[] | object[]): string;
    _container_of(type: string, current: number): PageContainer;
    _dir_of(type: string): string;
    moment: typeof moment;
    [key: string]: Function;
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
                throw new Error('Invalid type passed to helper: _container_of');
            }
        },
        _dir_of(type) {
            let cwd = process.cwd();
            switch (type) {
                case 'public':
                    return ctx.PUBLIC_DIRECTORY;
                case 'source':
                    return ctx.SOURCE_DIRECTORY;
                case 'cwd':
                    return cwd;
                default:
                    return '';
            }
        },
        css(param0) {
            if (Array.isArray(param0)) {
                return param0.map(v => this.css(v)).join('\n');
            }
            if (typeof param0 === 'string') {
                return `<link rel='stylesheet' href=${param0}>`;
            }
            else {
                return `<link${Object.entries(param0).map(([k, v]) => ` ${k}=${v}`).join()}>`;
            }
        },
        js(param0) {
            if (Array.isArray(param0)) {
                return param0.map(v => this.js(v)).join('\n');
            }
            if (typeof param0 === 'string') {
                return `<script src=${param0}></script>`;
            }
            else {
                return `<script${Object.entries(param0).map(([k, v]) => ` ${k}=${v}`).join()}></script>`;
            }
        },
        moment,
        ...ctx.plugin.helpers
    }
}