import { SettingsTemplate } from '../core/config_template.js';
import { mkdir, } from 'fs';
import * as fs from 'fs';
import { Nil } from '../lib/closures.js';
import { Cache } from '../core/struct.js';
import { join } from 'path';

const POST_TEMPLATE = 
`---
title: TITLE
date: 1970-1-1
tags: TAG_A TAG_B?
category: CATEGORY
---
SOME FOREWORDS
<!--more-->`;

let cache = new Cache();
cache.set('postd','posts');
cache.set('publicd','public')

/**
 * 
 * @returns {string}
 */
function get_default_configuration() {
    return SettingsTemplate
}

function make_default_directory() {
    mkdir('posts', {}, Nil);
    mkdir('public', {}, Nil);
    mkdir('resources', {}, Nil);
    mkdir('extra', {}, Nil);
}

function make_common_file(){
    fs.writeFile(join('posts','about.md'),POST_TEMPLATE,Nil);
    fs.writeFile(join('posts','template.md'),POST_TEMPLATE,Nil);
    fs.writeFile('./config.json',JSON.stringify(SettingsTemplate,null,4),Nil);
}

function remove_directory() {
    rm('posts');
    rm('public');
}

function rm(path){
    if(fs.statSync(path).isFile()){
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

export {
    get_default_configuration,
    make_default_directory,
    make_common_file,
    remove_directory
}