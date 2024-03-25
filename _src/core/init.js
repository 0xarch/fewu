import { join } from 'path';
import * as fs from 'fs';
import { SettingsTemplate } from '#core/config_template';

const Nil = ()=>{};

const POST_TEMPLATE =
    `---
title: TITLE
date: 1970-1-1
tags: TAG_A TAG_B?
category: CATEGORY
---
SOME FOREWORDS
<!--more-->`;

/**
 * 
 * @returns {string}
 */
function get_default_configuration() {
    return SettingsTemplate
}

function make_default_directory() {
    fs.mkdir('posts', {}, Nil);
    fs.mkdir('public', {}, Nil);
    fs.mkdir('resources', {}, Nil);
    fs.mkdir('extra', {}, Nil);
    fs.mkdir('_themes',{},Nil);
}

function make_common_file() {
    safeWriteFile(join('posts', 'about.md'), POST_TEMPLATE, Nil);
    safeWriteFile(join('posts', 'template.md'), POST_TEMPLATE, Nil);
    safeWriteFile('./config.json', JSON.stringify(SettingsTemplate, null, 4), Nil);
}

function remove_directory() {
    rm('posts');
    rm('public');
}

function rm(path) {
    if (fs.statSync(path).isFile()) {
        fs.rm(path);
        return;
    }
    for (let path_ of fs.readdirSync(path)) {
        if (path_[0] != '.') {
            path_ = join(path, path_);
            if (fs.statSync(path_).isFile()) {
                fs.rm(path, Nil);
            } else {
                fs.rmdir(path, Nil);
            }
        }
    }
}

function safeWriteFile(path, data, callback) {
    if (fs.existsSync(path)) return;
    else fs.writeFile(path, data, callback);
}

export {
    get_default_configuration,
    make_default_directory,
    make_common_file,
    remove_directory
}