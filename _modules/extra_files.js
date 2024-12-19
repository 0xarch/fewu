import { cp } from "fs";
import { join } from "path";

const Module = {
    exec: async () => {
        let config = globalThis.database.data.module.options.extra_files;
        if(!config) return -1;
        let source_path = config?.from ?? 'extra';
        let extra_file = config?.list;
        if(!Array.isArray(extra_file)) return;
        for (let k of extra_file) {
            cp(join(source_path, k), join(PUBLIC_DIRECTORY, k), {recursive:true}, (e) => {if(e)throw e});
        }
    }
}

export default Module;
