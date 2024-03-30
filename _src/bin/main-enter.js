#!/usr/bin/env node

import { gopt } from "#core/run";

let opt = gopt(process.argv);

if(opt.new){
    (await import("../app/new.js"));
} else if (opt.init) {
    const init = await (import('#core/init'));
    const {info} = await (import('#core/run'));
    info(['Init', 'YELLOW'], ['Making directories']);
    init.make_default_directory();
    info(['Init', 'YELLOW'], ['Touching templates']);
    init.make_common_file();
} else if (opt.help) {
    console.log(`--- Fewu Static Generator ---

executing fewu directly without any arguments,
is the same as executing fewu --config config.json --release

Avaiable arguments:
--new                   Touch a markdown file with basic information frame in the posts directory.
                        This argument will override all arguments.

--init                  Setup environment for building website.
                        This will make some directories and write some files,
                        maybe you can run with this argument many times.
                        This argument will override all arguments.

--help                  Display this page.
                        This argument will override all arguments.

--release               Build website in release mode.

--devel                 Build website in developer mode.

--config $CONFIG_FILE   Choose a configuration file.

--theme $THEME_NAME     Override theme name in configuration file.

------------ Help ------------`);
} else {
    (await import("../app/app.js")).default(gopt(process.argv));

}