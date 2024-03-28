#!/usr/bin/env node

import { gopt } from "#core/run";

let opt = gopt(process.argv);
if(opt.new){
    (await import("../app/new.js"));
} else {
    (await import("../app/app.js")).default();

}