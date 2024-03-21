import db from "../core/database.js";
import { cp } from "fs";
import { join } from "path";

const Module = {
    exec: async () => {
        if (db.settings.has('extra_files')) {
            let extra_file = db.settings.get('extra_files');
            for (let k in extra_file) {
                cp(join('extra', k), join(db.dirs.public, extra_file[k]), () => { });
            }
        }
    }
}

export default Module;