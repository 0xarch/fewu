#!/usr/bin/env node

import { gopt } from "#core/run";

let opt = gopt(process.argv);

if (opt.new) {
    (await import("../app/new.js")).default(opt);
} else if (opt.init) {
    const init = await (import('#core/init'));
    const { info } = await (import('#core/run'));
    info(['Init', 'YELLOW'], ['Making directories']);
    init.make_default_directory();
    info(['Init', 'YELLOW'], ['Touching templates']);
    init.make_common_file();
} else if (opt.help) {
    (await import('../app/help.js')).default();
} else {
    (await import("../app/app.js")).default(opt);
}