import { AbstractSection } from "./abstract.mjs";
import NewPromise from "#util/NewPromise";

class UserSection extends AbstractSection {
    name;
    url;
    avatar;
    data;
    constructor(config){
        let {promise,resolve} = NewPromise.withResolvers();
        super({
            mutable: false
        },promise);
        this.name = config.name;
        this.url = config.url ?? '/';
        this.avatar = config.avatar;
        this.data = Object.fromEntries(Object.entries(config.user?.data ?? {}));

        resolve('user');
    }
}

export default UserSection;