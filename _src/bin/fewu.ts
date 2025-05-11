#!/usr/bin/env node

import "#util/Argv";

async function navigation(){
    let executing_task: Function;
    if(process.argv.includes('--new') || process.argv.includes('-n')){
        executing_task = (await import("./entrance/new.mjs")).default;
    } else if (process.argv.includes('--init')) {
        executing_task = (await import("./entrance/init.mjs")).default;
    } else if (process.argv.includes('--help') || process.argv.includes('-h')) {
        executing_task = (await import("./entrance/help.mjs")).default;
    } else {
        executing_task = (await import("./entrance/switcher.mjs")).default;
    }
    executing_task();
}

navigation();