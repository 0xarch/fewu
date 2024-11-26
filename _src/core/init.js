import { join } from 'path';
import { existsSync } from 'fs';
import { writeFile, mkdir, rm } from 'fs/promises';
import { SettingsTemplate } from '#core/config_template';

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
    mkdir('posts');
    mkdir('public');
    mkdir('resources');
    mkdir('extra');
    mkdir('_themes');
    mkdir('_modules');
}

function make_common_file() {
    safeWriteFile(join('posts', 'about.md'), POST_TEMPLATE);
    safeWriteFile(join('posts', 'template.md'), POST_TEMPLATE);
    safeWriteFile('./config.json', JSON.stringify(SettingsTemplate, null, 4));
}

function remove_directory() {
    rm('posts', {recursive: true});
    rm('public',{recursive: true});
}

function safeWriteFile(path, data) {
    if (existsSync(path)) return;
    else writeFile(path, data);
}

export {
    get_default_configuration,
    make_default_directory,
    make_common_file,
    remove_directory
}