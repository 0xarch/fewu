#!/usr/bin/env node
import Argv from "#util/Argv";

import { gopt } from "#core/run";

let opt = gopt(process.argv);

async function navigation(){
    let executing_task;
    if(process.argv.includes('--new') || process.argv.includes('-n')){
        executing_task = (await import("../app/new.js")).default;
    } else if (process.argv.includes('--init')) {
        executing_task = async function(){
            const init = await (import('#core/init'));
            const { info } = await (import('#core/run'));
            info(['Init', 'YELLOW'], ['Making directories']);
            init.make_default_directory();
            info(['Init', 'YELLOW'], ['Touching templates']);
            init.make_common_file();
        }
    } else if (process.argv.includes('--help') || process.argv.includes('-h')) {
        executing_task = (await import("../app/help.js")).default;
    } else {
        executing_task = (await import("../app/app.js")).default;
    }
    executing_task(opt);
}

navigation();