import { join } from 'path';
import { existsSync } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import { value as config } from '#common/config.json';
import StandaloneApp from '#util/ts/StandaloneApp';

const app = new StandaloneApp({
    version: '2.0.0',
    name: 'io.fewu.initWorkspace'
});

const POST_TEMPLATE =
    `---
title: TITLE
date: 1970-1-1
tags: TAG_A TAG_B?
category: CATEGORY
---
SOME FOREWORDS
<!--more-->`;

async function safeWriteFile(path: string, data: string) {
    if (existsSync(path)) return;
    else writeFile(path, data);
}

async function App() {
    console.info(app.humanize());
    const requiredDirectories = ['posts', 'public', 'resources', 'extra', '_themes', '_modules'];
    for (let directory of requiredDirectories) {
        mkdir(directory, { recursive: true });
    }
    safeWriteFile(join('posts', 'about.md'), POST_TEMPLATE);
    safeWriteFile(join('posts', 'template.md'), POST_TEMPLATE);
    safeWriteFile('./config.json', config());
}

export default App;