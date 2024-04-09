import { cp } from "fs";
import { join } from "path";

const Module = {
    exec: async () => {
        let config = database.config.modules.extra_files;
        if(!config) return -1;
        let source_path = config?.from ?? 'extra';
        let extra_file = config?.list;
        if(!extra_file instanceof Array) return;
        for (let k of extra_file) {
            cp(join(source_path, k), join(PUBLIC_DIRECTORY, k), () => { });
        }
    }
}

export default Module;