import { SettingsTemplate } from '../core/config_template.js';
import { mkdir, } from 'fs';
import * as fs from 'fs';
import { Nil } from '../lib/closures.js';
import Cache from '../lib/class.cache.js';
import db from '../core/database.js';
import { join } from 'path';

let cache = new Cache();

/**
 * 
 * @returns {string}
 */
function get_default_configuration() {
    return SettingsTemplate
}

function make_default_directory() {
    let posts_ = cache.has_or_set('postd', db.settings.get('build.post_directory'));
    let public_ = cache.has_or_set('publicd', db.settings.get('build.public_directory'));
    mkdir(posts_, {}, Nil);
    mkdir(public_, {}, Nil);
    mkdir('resources', {}, Nil);
    mkdir('extra', {}, Nil);
}

function remove_directory(settings) {
    let posts_ = cache.has_or_set('postd', db.settings.get('build.post_directory'));
    let public_ = cache.has_or_set('publicd', db.settings.get('build.public_directory'));
    rm(posts_);
    rm(public_);
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
    remove_directory
}