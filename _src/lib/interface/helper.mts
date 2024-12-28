import { Context } from "#lib/types";
import { join } from "path";

declare interface Helpers {
    url_for(relative_path: string): string;
}

export function getHelpers(ctx: Context): Helpers {
    return {
        url_for(relative_path) {
            return join(ctx.config.root, relative_path);
        }
    }
}