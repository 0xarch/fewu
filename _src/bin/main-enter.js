#!/usr/bin/env node

import "#util/Argv";

async function navigation(){
    let executing_task;
    if(process.argv.includes('--new') || process.argv.includes('-n')){
        executing_task = (await import("../app/new.js")).default;
    } else if (process.argv.includes('--init')) {
        executing_task = (await import("../app/init.js")).default;
    } else if (process.argv.includes('--help') || process.argv.includes('-h')) {
        executing_task = (await import("../app/help.js")).default;
    } else {
        executing_task = (await import("../app/app.js")).default;
    }
    executing_task();
}

navigation();