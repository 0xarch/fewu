import { readFileSync } from "fs";
import { join as join_path } from "path";
import { errno } from "./mod.js";
import { build_and_write } from "../modules/app/builder.js";
import { Correspond } from "./file_class.js";
import Collection from './class.collection.js';
import Layout from "./class.layout.js";

/**
 * 
 * @param {Collection} theme 
 * @param {Collection} config 
 * @param {Collection} collection 
 * @param {Layout} file
 * @param {{}} option
 */
async function write(theme, config, collection, file, option) {
    let theme_directory = join_path('themes', config.get('theme.name'));
    let absolute_correspond = new Correspond(
        join_path(theme_directory, 'layouts', file.correspond().from),
        join_path(config.get('public_directory') || config.get('build.public_directory'), file.correspond().to, 'index.html'));

    // _______ get
    let template = readFileSync(absolute_correspond.from).toString();
    let template_type = theme.get('layout.type');
    const opt = file.option();

    // _______ define vars
    let iter = { "MAIN": {} };
    let addition = {};

    // _______ proc
    if (file.has_addition()) {
        let map = file.addition();
        for (let key in map) {
            addition[key] = collection.get(map[key]);
        }
    }
    if (file.is_varias()) {
        if (!opt.varias) {
            errno(8102);
            return;
        }
        iter = {};
        let v_parent = collection.get(opt.varias.parent);
        let time = 0;
        for (let key in v_parent) {
            let iter_key = 'V' + time;
            let varias = {
                enabled: true,
                name: key,
                iter_key,
                value: v_parent[key]
            }
            iter[iter_key] = {
                ...iter[iter_key],
                varias
            };
            time++;
        }
    }

    for (let key in iter) {
        let addition_in_iter = iter[key];
        let path_write_to_prefix = join_path(config.get('public_directory') || config.get('build.public_directory'));
        if (addition_in_iter.varias) {
            let varias = addition_in_iter.varias; varias;//used in eval
            path_write_to_prefix += '/' + eval('`' + file.correspond().to + '`');
        } else {
            path_write_to_prefix = join_path(path_write_to_prefix, file.correspond().to);
        }
        if (file.is_cycling()) {
            if (!opt.cycling) {
                errno(8103);
                return;
            }
            let c_opt = opt.cycling;
            let c_parent = collection.get(c_opt.parent) || new Collection(addition_in_iter).get(c_opt.parent) || new Collection(addition).get(c_opt.parent);
            let cycling_results = cycling(c_parent, c_opt.every, path_write_to_prefix);
            for (let result of cycling_results) {
                build_and_write(template_type, template, {
                    basedir: join_path(theme_directory, 'layouts'),
                    filename: file.correspond().from
                }, {
                    ...collection.get_all(),
                    ...addition,
                    ...addition_in_iter,
                    cycling: result,
                }, theme, result.path);
            }
        } else {
            let path = path_write_to_prefix + '/index.html';
            build_and_write(template_type, template, {
                basedir: join_path(theme_directory, 'layouts'),
                filename: file.correspond().from
            }, {
                ...collection.get_all(),
                ...addition,
                ...addition_in_iter,
            }, theme, path);
        }
    }
    return;
}

function cycling(parent, every, prefix = '') {
    if (!Array.isArray(parent)) {
        let _arr = [];
        for (let key in parent) {
            _arr.push({ key, value: parent[key] });
        }
        parent = _arr;
    }
    let len = parent.length;
    let results = [];
    for (let i = 0; i * every < len; ++i) {
        let Cycling = {
            enabled: true,
            total: Math.ceil(len / every),
            now: i + 1,
            value: parent.slice(i * every, (i + 1) * every),
            prev_path: join_path(prefix, (i) + '/index.html'),
            next_path: join_path(prefix, (i + 2) + '/index.html'),
            path: join_path(prefix, (i + 1) + '/index.html')
        };
        results.push(Cycling);
    }
    return results;
}

export {
    write
}