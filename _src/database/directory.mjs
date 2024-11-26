import { AbstractSection } from "./abstract.mjs";
import NewPromise from "#util/NewPromise";

class DirectorySection extends AbstractSection {
    postDirectory = '';
    publicDirectory = '';
    buildRootDirectory = '';

    constructor(config){
        let {promise,resolve} = NewPromise.withResolvers();
        super({
            mutable: false
        },promise);
        this.postDirectory = config.general['post-directory'] ?? config.build?.posts ?? config.build?.post_directory ?? config.postDirectory ?? config.post_directory ?? "posts";
        this.publicDirectory = config.general['public-directory'] ?? config.build?.public ?? config.build?.public_directory ?? config.publicDirectory ?? config.public_directory ?? "public";
        this.buildRootDirectory = config.general['site-relative-root'] ?? config.build?.root ?? (()=>{
            let urlRegex = /(?:.*?:\/\/)?(?:.*?\.).*?\..*?\//;
            let configuredPageUrl = config.website?.url ?? config.website?.URL;
            if (urlRegex.test(configuredPageUrl)) {
                let urlRoot = urlRegex.exec(configuredPageUrl)[0];
                let relativeUrl = configuredPageUrl.replace(urlRoot, '');
                if (relativeUrl.endsWith('/')) {
                    relativeUrl = relativeUrl.slice(0, -1);
                }
                return relativeUrl;
            } else {
                return '';
            }
        })();
        resolve('diretory');
    }
}

export default DirectorySection;