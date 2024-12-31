import { Context, Page } from "#lib/types";
import { join } from "path";

declare interface Helpers {
    url_for(path: string): string;
    full_url_for(path: string): string;
}

export function getHelpers(ctx: Context,page: Page): Helpers {
    return {
        url_for(path) {
            if(path.startsWith('/')){
                return join(path);
            }
            return join(ctx.config.root, path);
        },
        full_url_for(path) {
            return join(ctx.config.url, path)
        }
    }
}