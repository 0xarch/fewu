import db from "#db";
import { cp } from "fs";
import { join } from "path";

const Module = {
    exec: async () => {
        let config = Databse.config.modules.extra_files;
        if(!config) return -1;
        let source_path = config?.from ?? 'extra';
        let extra_file = config?.list;
        if(!extra_file instanceof Array) return;
        for (let k in extra_file) {
            cp(join(source_path, k), join(db.dirs.public, extra_file[k]), () => { });
        }
    }
}

export default Module;