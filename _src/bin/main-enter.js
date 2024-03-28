#!/usr/bin/env node

import { gopt } from "#core/run";

let opt = gopt(process.argv);

if(opt.new){
    (await import("../app/new.js"));
} else if (opt.help) {
    console.log(`--- Nexo Static Generator ---

executing nexo-cli directly without any arguments,
is the same as executing nexo-cli --config config.json --release

Avaiable arguments:
--new                   Touch a markdown file with basic information frame in the posts directory.
                        This argument will override all arguments.

--help                  Display this page.
                        This argument will override all arguments except --new.

--release               Build website in release mode.

--devel                 Build website in developer mode.

--init                  Setup environment for building website.
                        This will make some directories and write some files,
                        maybe you can run with this argument many times.

--config $CONFIG_FILE   Choose a configuration file.

--theme $THEME_NAME     Override theme name in configuration file.

------------ Help ------------`);
} else {
    (await import("../app/app.js")).default(process.argv);

}