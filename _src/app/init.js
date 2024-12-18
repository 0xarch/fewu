import { join } from 'path';
import { existsSync } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import { value as config } from '#common/config.json';

const POST_TEMPLATE =
    `---
title: TITLE
date: 1970-1-1
tags: TAG_A TAG_B?
category: CATEGORY
---
SOME FOREWORDS
<!--more-->`;

async function safeWriteFile(path, data) {
    if (existsSync(path)) return;
    else writeFile(path, data);
}

async function App() {
    const requiredDirectories = ['posts', 'public', 'resources', 'extra', '_themes', '_modules'];
    for (let directory of requiredDirectories) {
        mkdir(directory, { recursive: true });
    }
    safeWriteFile(join('posts', 'about.md'), POST_TEMPLATE);
    safeWriteFile(join('posts', 'template.md'), POST_TEMPLATE);
    safeWriteFile('./config.json', config());
}

export default App;