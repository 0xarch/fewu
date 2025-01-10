import { join } from 'path';
import { existsSync } from 'fs';
import { writeFile, mkdir } from 'fs/promises';
import moment from 'moment';
import { value as config } from '#common/config.yaml';
import StandaloneApp from '#util/ts/StandaloneApp';
import { unzip, gunzip } from 'zlib';

const app = new StandaloneApp({
    version: '2.1.0',
    name: 'io.fewu.initWorkspace'
});

const POST_TEMPLATE =
    `---
title: Welcome to the Frendly Extensible Website Unifier.
date: ${moment().format('YYYY-MM-DD HH:mm:ss')}
tags: Tag
category: Articles
---
Here is excerpt.
<!--more-->`;

async function safeWriteFile(path: string, data: string) {
    if (existsSync(path)) return;
    else writeFile(path, data);
}

async function _remote() {
    let url = `https://github.com/0xarch/next-theme/archive/refs/heads/master.zip`;
    let tmpFilename = `.tmp.io.fewu.initWorkspace.remoteFile.theme.zip`;
    console.log(`Downloading default theme: Next<${url}>`);
    let resp = await fetch(url, {
        headers: {
            'accept-encoding': 'gzip,deflate'
        }
    });
    let buff = await resp.arrayBuffer();
    gunzip(buff, (err, result) => {
        if (err) {
            console.log(`Error trying download theme.`);
            console.error(err);
        }
        console.log(result.toString());
    });
}

async function _local() {
    const requiredDirectories = ['posts', 'public', 'themes'];
    for (let directory of requiredDirectories) {
        mkdir(directory, { recursive: true });
    }
    safeWriteFile(join('posts', 'about.md'), POST_TEMPLATE);
    safeWriteFile(join('posts', 'template.md'), POST_TEMPLATE);
    safeWriteFile('./config.yaml', config());
    console.log(`Initialization complete. Check posts,public,themes folder and config.yaml.`);
}

async function App() {
    console.info(app.humanize());
    await _local();
    await _remote();
}

export default App;